class Polaris {
  constructor() {
    this.polaris()
  }

  polaris() {
    const cardHeaderActions = `<div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-darker:#006d74; --top-bar-background-lighter:#1d9ba4;">
    <div class="Polaris-Card">
      <div class="Polaris-Card__Header">
        <div class="Polaris-Stack Polaris-Stack--alignmentBaseline">
          <div class="Polaris-Stack__Item Polaris-Stack__Item--fill">
            <h2 class="Polaris-Heading">${themeName}</h2>
          </div>
          <div class="Polaris-Stack__Item">
            <div class="Polaris-ButtonGroup">
              <div class="Polaris-ButtonGroup__Item Polaris-ButtonGroup__Item--plain"><button type="button" class="Polaris-Button Polaris-Button--plain"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text"><a href="https://google.com" target="_blank">Preview</a></span></span></button></div>
            </div>
          </div>
        </div>
      </div>
      <div class="Polaris-Card__Section">
        <p>Theme ID: <strong>${themeId}</strong></p>
      </div>
    </div>
    </div>`
  }
}

export default Polaris