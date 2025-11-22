/**
 * 해시 기반 라우터
 * URL 해시 (#home, #play 등)를 기반으로 페이지 전환
 */

import { getRouteFromHash } from '../utils/helpers.js';

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeRouteChange = null;
        this.afterRouteChange = null;
    }
    
    /**
     * 라우트 등록
     */
    register(path, handler) {
        this.routes.set(path, handler);
    }
    
    /**
     * 라우트 변경 전 훅 설정
     */
    onBeforeRouteChange(callback) {
        this.beforeRouteChange = callback;
    }
    
    /**
     * 라우트 변경 후 훅 설정
     */
    onAfterRouteChange(callback) {
        this.afterRouteChange = callback;
    }
    
    /**
     * 라우트 이동
     */
    navigate(path) {
        if(path.startsWith('#')) {
            path = path.slice(1);
        }
        
        window.location.hash = path;
        this.handleRoute();
    }
    
    /**
     * 현재 라우트 처리
     */
    async handleRoute() {
        const route = getRouteFromHash();
        
        // 동적 라우트 매칭
        let handler = this.routes.get(route);
        let matchedRoute = route;
        
        if(!handler) {
            // 동적 라우트 패턴 매칭 시도
            for(const [pattern, routeHandler] of this.routes.entries()) {
                if(pattern.includes(':')) {
                    const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
                    const match = route.match(regex);
                    if(match) {
                        handler = routeHandler;
                        matchedRoute = route;
                        break;
                    }
                }
            }
        }
        
        if(!handler) {
            // 404 처리
            const defaultHandler = this.routes.get('404') || this.routes.get('home');
            if(defaultHandler) {
                await this.executeHandler(defaultHandler);
            }
            return;
        }
        
        // 동적 라우트인 경우 route 파라미터 전달
        if(typeof handler === 'function' && handler.length > 0) {
            await this.executeHandler(() => handler(matchedRoute));
        } else {
            await this.executeHandler(handler);
        }
    }
    
    /**
     * 핸들러 실행
     */
    async executeHandler(handler) {
        try {
            // beforeRouteChange 훅 실행
            if(this.beforeRouteChange) {
                await this.beforeRouteChange(this.currentRoute);
            }
            
            // 페이지 렌더링
            await handler();
            
            this.currentRoute = getRouteFromHash();
            
            // afterRouteChange 훅 실행
            if(this.afterRouteChange) {
                await this.afterRouteChange(this.currentRoute);
            }
        } catch(error) {
            console.error('Route handler error:', error);
        }
    }
    
    /**
     * 라우터 초기화
     */
    init() {
        // 해시 변경 이벤트 리스너
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
        
        // 초기 라우트 처리
        this.handleRoute();
    }
}

// 싱글톤 인스턴스
export const router = new Router();
