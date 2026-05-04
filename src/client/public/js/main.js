document.addEventListener('DOMContentLoaded', function() {
  const portraitImage = document.getElementById('portrait-image');
  const printBtn = document.getElementById('print-btn');
  const saveImageBtn = document.getElementById('save-image-btn');
  const styleButtons = document.querySelectorAll('.style-btn');
  const photoThumbs = document.querySelectorAll('.photo-thumb');
  const langToggle = document.getElementById('lang-toggle');
  
  let currentStyle = 'original';
  let currentQuoteIndex = 0;
  
  function updateStyle(style) {
    currentStyle = style;
    if (!portraitImage) return;
    
    portraitImage.className = 'portrait-image style-' + style;
    
    styleButtons.forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.style === style);
    });
  }
  
  function updatePhoto(src) {
    if (!portraitImage) return;
    portraitImage.src = src;
    window.personPhoto = src;
  }
  
  function updateQuote(index) {
    if (!window.personQuotes || !window.personQuotes.length) return;
    
    currentQuoteIndex = index;
    var quote = window.personQuotes[index];
    var quoteDisplay = document.getElementById('quote-display');
    var counter = document.querySelector('.quote-counter');
    var dots = document.querySelectorAll('.quote-dot');
    
    if (quoteDisplay) {
      var quoteText = quoteDisplay.querySelector('.quote-text');
      var quoteSource = quoteDisplay.querySelector('.quote-source');
      
      if (window.currentLang === 'en') {
        quoteText.textContent = quote.textEn || quote.text;
        quoteSource.textContent = quote.sourceEn || quote.source;
      } else {
        quoteText.textContent = quote.text;
        quoteSource.textContent = quote.source;
      }
    }
    
    if (counter) {
      counter.textContent = (index + 1) + ' / ' + window.personQuotes.length;
    }
    
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }
  
  function generateQRCode(elementId, url) {
    var qrImg = document.getElementById(elementId);
    if (!qrImg || !url) return;
    
    var encodedUrl = encodeURIComponent(url);
    qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodedUrl;
  }
  
  function generateFooterQR() {
    var pageUrl = window.currentPageUrl || window.location.href;
    generateQRCode('footer-qr-code', pageUrl);
  }
  
  function generatePrintQR() {
    var personUrl = window.personUrl || window.location.href;
    generateQRCode('print-qr-code', personUrl);
  }
  
  function preparePrintPoster() {
    var poster = document.getElementById('print-poster');
    var bgImg = document.getElementById('print-poster-bg');
    if (!poster) return;

    if (bgImg && window.personPhoto) {
      bgImg.src = window.personPhoto;
      bgImg.className = 'print-poster-bg portrait-image style-' + currentStyle;
    }

    // Sync currently selected quote
    if (window.personQuotes && window.personQuotes.length > 0) {
      var quote = window.personQuotes[currentQuoteIndex];
      var quoteEl = poster.querySelector('.print-poster-quote');
      var sourceEl = poster.querySelector('.print-poster-source');
      if (quoteEl) {
        quoteEl.textContent = window.currentLang === 'en' ? (quote.textEn || quote.text) : quote.text;
      }
      if (sourceEl) {
        sourceEl.textContent = window.currentLang === 'en' ? (quote.sourceEn || quote.source) : quote.source;
      }
    }

    generatePrintQR();
  }
  
  function downloadPoster() {
    var poster = document.getElementById('print-poster');
    if (!poster) return;

    preparePrintPoster();

    // Show poster as fullscreen overlay for capture
    poster.style.cssText = 'display:block; position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999;';

    setTimeout(function() {
      html2canvas(poster, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#000'
      }).then(function(canvas) {
        poster.style.cssText = '';

        var personName = document.querySelector('.person-name');
        var name = personName ? personName.textContent.trim() : 'poster';
        var link = document.createElement('a');
        link.download = name + '-poster.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(function(err) {
        console.error('Failed to generate poster:', err);
        poster.style.cssText = '';
        alert(window.currentLang === 'en' ? 'Failed to generate image' : '生成图片失败');
      });
    }, 600);
  }
  
  if (styleButtons.length > 0) {
    styleButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        updateStyle(this.dataset.style);
      });
    });
  }
  
  if (photoThumbs.length > 0) {
    photoThumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        updatePhoto(this.dataset.src);
        
        photoThumbs.forEach(function(t) {
          t.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
  }
  
  var prevBtn = document.querySelector('.quote-prev');
  var nextBtn = document.querySelector('.quote-next');
  var quoteDots = document.querySelectorAll('.quote-dot');
  
  if (prevBtn && window.personQuotes) {
    prevBtn.addEventListener('click', function() {
      var newIndex = (currentQuoteIndex - 1 + window.personQuotes.length) % window.personQuotes.length;
      updateQuote(newIndex);
    });
  }
  
  if (nextBtn && window.personQuotes) {
    nextBtn.addEventListener('click', function() {
      var newIndex = (currentQuoteIndex + 1) % window.personQuotes.length;
      updateQuote(newIndex);
    });
  }
  
  if (quoteDots.length > 0) {
    quoteDots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        updateQuote(parseInt(this.dataset.index));
      });
    });
  }
  
  if (langToggle) {
    langToggle.addEventListener('click', function() {
      var currentLang = this.dataset.lang;
      var newLang = currentLang === 'en' ? 'zh' : 'en';
      var path = window.location.pathname;
      
      if (newLang === 'en') {
        window.location.href = '/en' + path;
      } else {
        window.location.href = path.replace(/^\/en/, '') || '/';
      }
    });
  }
  
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      preparePrintPoster();
      setTimeout(function() {
        window.print();
      }, 500);
    });
  }
  
  if (saveImageBtn) {
    saveImageBtn.addEventListener('click', function() {
      downloadPoster();
    });
  }
  
  generateFooterQR();
  generatePrintQR();
});
