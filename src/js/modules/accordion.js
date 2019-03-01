import $ from 'jquery'

class Accordion {
  constructor() {
    this.accordion()
  }

  accordion() {
    document.addEventListener('DOMContentLoaded', function () {
      $('[data-accordion-toggle]').click(function () {
        const thisTab = $(this);
        $(this).toggleClass('is-active')
        $(this).next('[data-accordion-body]')
          .slideToggle(200)

        $('[data-accordion-toggle]')
          .not(thisTab)
          .removeClass('is-active')
        $('[data-accordion-toggle]')
          .not(thisTab)
          .next('[data-accordion-body]')
          .slideUp(200)
      })
    })
  }
};

export default Accordion
