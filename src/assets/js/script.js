((w) => {
    const masks = {
        number: (e) => e.target.value.replace(/\D/g, '')
    };

    w.addEventListener('load', () => {
        document.addEventListener('input', (e) => {
            const dataset = e.target.dataset;

            if (typeof dataset.mask !== typeof undefined) {
                e.target.value = masks[dataset.mask](e);
            }
        }, false);
    });
})(window);