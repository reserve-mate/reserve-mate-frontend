export const scrollToWhenReady = (y: number) => {
    const tryScroll = () => {
        if(document.body.scrollHeight - window.innerHeight >= y) {
            window.scrollTo({ top: y, behavior: 'auto' });
            return; // 성공 → 종료
        }

        requestAnimationFrame(tryScroll);
    }

    tryScroll();
}