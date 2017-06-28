;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-guanbi" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M760.925884 715.347315 557.592896 512.014326 760.957607 308.648592 715.372386 263.064394 512.009721 466.431152 308.652174 263.073604 263.066953 308.657802 466.4245 512.01535 263.065929 715.37392 308.649104 760.957095 512.008698 557.598524 715.341686 760.932536Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-wujiaoxing" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 832.576 195.584 998.912 256 646.592 0 397.056 353.792 345.664 512 25.088 670.208 345.664 1024 397.056 768 646.592 828.416 998.912Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-my_account" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 639.008q159.008 0 331.488 68.992t172.512 180.992l0 127.008-1008 0 0-127.008q0-112 172.512-180.992t331.488-68.992zM512 512q-103.008 0-176.512-73.504t-73.504-176.992 73.504-178.496 176.512-75.008 176.512 75.008 73.504 178.496-73.504 176.992-176.512 73.504z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-wujiaoxing1" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M769.899392 930.271268l-0.854421-0.47168-256.146733-141.457692-257.00615 141.929372 0.157293-0.963347 48.901645-299.488147L97.781888 417.719978l286.365044-43.709765L512.899438 100.015182l0.430708 0.913381 128.321598 273.081651 286.35725 43.709765-0.645562 0.660552L720.847849 629.819774 769.899392 930.271268zM99.751952 418.378531l206.212588 211.12026-0.037974 0.236839L257.143441 928.495472l255.754998-141.236841 0.229844 0.124915L768.650239 928.495472l-48.815703-298.99648 0.167886-0.170884 206.034708-210.949376-285.027951-43.507302-0.106928-0.228845L512.899438 102.246669l-128.109342 272.624561-0.249831 0.038574L99.751952 418.378531z"  ></path>' +
    '' +
    '<path d="M235.646016 958.986799l5.254837-32.154199 47.652092-291.834336L65.910497 407.057207l307.826494-46.985544 139.136266-296.093049 14.339278 30.401788 124.848952 265.691261 307.830491 46.987542-21.552387 22.05045-201.094058 205.888408 52.893138 323.975545-28.51067-15.735132-248.729761-137.361469L235.646016 958.986799zM512.842477 769.754498l7.619834 4.14519 227.947851 125.883451-44.978305-275.488619 5.61919-5.721121 185.116091-189.531897-263.592684-40.23572-3.580572-7.670799L512.899438 138.338199l-117.693804 250.460588-8.330352 1.282131L131.623343 429.041302l190.721691 195.260014-1.262744 7.866666L277.384717 899.782939 512.842477 769.754498z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-home1" viewBox="0 0 1205 1024">' +
    '' +
    '<path d="M1024 542.117647 1204.705882 542.117647 602.352941 0 0 542.117647 180.705882 542.117647 180.705882 1024 1024 1024 1024 542.117647ZM481.882353 662.588235 722.823529 662.588235 722.823529 1024 481.882353 1024 481.882353 662.588235Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-tianjia" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z" fill="" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-caidan" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M192.037 287.953h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32zM192.028 543.17h638.608c17.673 0 32-14.327 32-32s-14.327-32-32-32H192.028c-17.673 0-32 14.327-32 32s14.327 32 32 32zM832.161 735.802H192.037c-17.673 0-32 14.327-32 32s14.327 32 32 32h640.124c17.673 0 32-14.327 32-32s-14.327-32-32-32z" fill="" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)