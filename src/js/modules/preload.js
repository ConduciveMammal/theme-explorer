import $ from 'jquery'

class Preload {
  constructor() {
    this.preload()
  }

  preload() {
    document.addEventListener('DOMContentLoaded', function () {
      function preloadScreen (showLoading) {
        const loadingScreen = document.getElementById('preloadScreen')
        console.log('Preloading!');

        if (showLoading) {
          console.log('Preloading Shown!')
          loadingScreen.classList.add('is-shown')
        } else {
          console.log('Preloading Hidden!')
          loadingScreen.classList.remove('is-shown')
        }
      }
      return preloadScreen
    })
  }
};

export default Preload
