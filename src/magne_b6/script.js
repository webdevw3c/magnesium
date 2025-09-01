$(function() {
  $('.slider.videos .list').slick({
    dots: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false
        }
      }
    ]
  });
});
