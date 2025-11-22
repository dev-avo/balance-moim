/**
 * 앱 시작점
 * 모든 초기화와 라우팅 설정을 담당
 */

import { router } from './services/router.js';
import { renderHeader } from './components/Header.js';
import { initToast } from './components/Toast.js';
import { initTheme } from './utils/theme.js';
import { renderHome } from './pages/home.js';
import { renderPlay } from './pages/play.js';
import { renderGroups } from './pages/groups.js';
import { renderCreateGroup } from './pages/groups/create.js';
import { renderGroupDetail } from './pages/groups/detail.js';
import { renderGroupSettings } from './pages/groups/settings.js';
import { renderCreateQuestion } from './pages/questions/create.js';
import { renderMyQuestions } from './pages/questions/my.js';
import { renderEditQuestion } from './pages/questions/edit.js';
import { renderSettings } from './pages/settings.js';
import { renderInvite } from './pages/invite.js';
import { render404 } from './pages/404.js';

/**
 * 앱 초기화
 */
async function init() {
    // 테마 초기화
    initTheme();
    
    // Toast 초기화
    initToast();
    
    // Header 렌더링
    await renderHeader();
    
    // 라우트 등록
    router.register('home', renderHome);
    router.register('play', renderPlay);
    router.register('groups', renderGroups);
    router.register('groups/create', renderCreateGroup);
    router.register('groups/:groupId', (route) => renderGroupDetail(route));
    router.register('groups/:groupId/settings', (route) => renderGroupSettings(route));
    router.register('questions/create', renderCreateQuestion);
    router.register('questions/my', renderMyQuestions);
    router.register('questions/:questionId/edit', (route) => renderEditQuestion(route));
    router.register('settings', renderSettings);
    router.register('invite/:inviteCode', (route) => renderInvite(route));
    router.register('404', render404);
    
    // 라우터 초기화
    router.init();
    
    // 라우트 변경 시 Header 업데이트
    router.onAfterRouteChange(async () => {
        await renderHeader();
    });
}

// DOM 로드 완료 후 초기화
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
