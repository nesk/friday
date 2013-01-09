(function() {
    
    /*
     * Flash
     */

    var day = new Date().getDay(),
        objects = document.getElementsByTagName('object'),
        index = +(day != 5);
    
    objects[index].style.display = 'block';

})();