$(document).on('input', '[data-mask="number"]', function () {
    this.value = this.value.replace(/\D/g, '');
}).find('[data-mask="number"]').trigger('input');
