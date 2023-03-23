(function () {
    $(document).ready(function () {
        $.get('/api/wizards', function (data) {
            console.log(data)
        });
    });
})();