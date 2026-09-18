/* ============================================
   i1 للبرمجيات — Custom JavaScript
   ============================================ */

$(document).ready(function() {

    // ============================================
    // Preloader
    // ============================================
    $(window).on('load', function() {
        setTimeout(function() {
            $('#preloader').addClass('hidden');
        }, 800);
    });

    // Fallback: hide preloader after 3 seconds max
    setTimeout(function() {
        $('#preloader').addClass('hidden');
    }, 3000);

    // ============================================
    // WOW.js Initialization
    // ============================================
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 80,
        mobile: true,
        live: true
    }).init();

    // ============================================
    // TypeIt Slider
    // ============================================
    if (typeof $.fn.typeIt !== 'undefined') {
        $('#type_it_slider').typeIt({
            speed: 50,
            autoStart: false,
            loop: true,
        })
        .tiType('حلول رقمية <strong>ذكية للمعلمين</strong> والطلاب')
        .tiSettings({ speed: 700 })
        .tiPause(1500)
        .tiSettings({ speed: 40 })
        .tiDelete()
        .tiType('أدوات <strong>مبتكرة</strong> للمؤسسات التعليمية')
        .tiSettings({ speed: 700 })
        .tiPause(1500)
        .tiSettings({ speed: 40 })
        .tiDelete()
        .tiType('أكثر من <strong>500 مدرسة</strong> تثق بإيوان')
        .tiSettings({ speed: 700 })
        .tiPause(1500)
        .tiSettings({ speed: 40 })
        .tiDelete()
        .tiType('<strong>المحتوى التعليمي</strong> والأدوات والبرامج')
        .tiSettings({ speed: 700 })
        .tiPause(1500)
        .tiSettings({ speed: 40 })
        .tiDelete()
        .tiType('من السعودية <strong>إلى مستقبل أكثر إشراقاً</strong>');
    }

    // ============================================
    // Smooth Scroll
    // ============================================
    $(".scroll").on('click', function(event) {
        event.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800, 'swing');
        }

        // Close mobile menu if open
        $('#navLinks').removeClass('active');
        $('#mobileOverlay').removeClass('active');
        $('body').css('overflow', '');
    });

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    $(window).on('scroll', function() {
        var scrollPos = $(this).scrollTop();

        // Navbar background
        if (scrollPos > 80) {
            $('#navbar').addClass('scrolled');
        } else {
            $('#navbar').removeClass('scrolled');
        }

        // Back to top button
        if (scrollPos > 500) {
            $('#backToTop').addClass('visible');
        } else {
            $('#backToTop').removeClass('visible');
        }

        // Active nav link
        var sections = ['home', 'programs', 'features', 'stats', 'testimonials', 'contact'];
        sections.forEach(function(section) {
            var el = $('#' + section);
            if (el.length) {
                var top = el.offset().top - 120;
                var bottom = top + el.outerHeight();
                if (scrollPos >= top && scrollPos < bottom) {
                    $('.nav-links li a').removeClass('active');
                    $('.nav-links li a[href="#' + section + '"]').addClass('active');
                }
            }
        });
    });

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    $('#mobileToggle').on('click', function() {
        $('#navLinks').toggleClass('active');
        $('#mobileOverlay').toggleClass('active');

        if ($('#navLinks').hasClass('active')) {
            $('body').css('overflow', 'hidden');
            $(this).html('<i class="fa fa-times"></i>');
        } else {
            $('body').css('overflow', '');
            $(this).html('<i class="fa fa-bars"></i>');
        }
    });

    $('#mobileOverlay').on('click', function() {
        $('#navLinks').removeClass('active');
        $(this).removeClass('active');
        $('body').css('overflow', '');
        $('#mobileToggle').html('<i class="fa fa-bars"></i>');
    });

    // ============================================
    // Back to Top
    // ============================================
    $('#backToTop').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // ============================================
    // Counter Animation
    // ============================================
    var counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;

        var statsSection = $('#stats');
        if (!statsSection.length) return;

        var sectionTop = statsSection.offset().top - $(window).height() + 100;

        if ($(window).scrollTop() > sectionTop) {
            counterAnimated = true;

            $('.counter').each(function() {
                var $this = $(this);
                var target = parseInt($this.attr('data-target'));
                var duration = 2000;
                var step = target / (duration / 30);
                var current = 0;

                var timer = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }

                    // Format number
                    var formatted = Math.floor(current);
                    if (target >= 1000) {
                        formatted = formatted.toLocaleString('ar-SA');
                    }
                    $this.text('+' + formatted);
                }, 30);
            });
        }
    }

    $(window).on('scroll', animateCounters);

    // ============================================
    // Owl Carousel — Testimonials
    // ============================================
    if (typeof $.fn.owlCarousel !== 'undefined') {
        $('.testimonial-carousel').owlCarousel({
            rtl: true,
            loop: true,
            margin: 30,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            smartSpeed: 800,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                1024: { items: 3 }
            }
        });
    }

    // ============================================
    // Parallax Effect (with parallax.js)
    // ============================================
    if (typeof $.fn.parallax !== 'undefined') {
        $('.hero-bg').parallax({ speed: 0.3 });
    }

    // ============================================
    // Hero Particles
    // ============================================
    function createParticles() {
        var container = $('#heroParticles');
        if (!container.length) return;

        for (var i = 0; i < 30; i++) {
            var size = Math.random() * 4 + 2;
            var left = Math.random() * 100;
            var delay = Math.random() * 15;
            var duration = Math.random() * 15 + 10;

            var particle = $('<div class="particle"></div>').css({
                width: size + 'px',
                height: size + 'px',
                left: left + '%',
                animationDelay: delay + 's',
                animationDuration: duration + 's'
            });

            container.append(particle);
        }
    }

    createParticles();

    // ============================================
    // Contact Form Handler
    // ============================================
    $('#btn-send').on('click', function() {
        var name = $('#input-name').val().trim();
        var email = $('#input-email').val().trim();
        var message = $('#input-message').val().trim();

        if (!name || !email || !message) {
            alert('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }

        // Simulate form submission
        var $btn = $(this);
        $btn.html('<i class="fa fa-spinner fa-spin"></i> جاري الإرسال...');
        $btn.prop('disabled', true);

        setTimeout(function() {
            $btn.html('<i class="fa fa-check"></i> تم الإرسال بنجاح!');
            $btn.css('background', 'linear-gradient(135deg, #00c853 0%, #00e676 100%)');

            // Reset form
            setTimeout(function() {
                $('#input-name, #input-email, #input-phone, #input-message').val('');
                $('#input-subject').val('');
                $btn.html('<i class="fa fa-paper-plane"></i> إرسال الرسالة');
                $btn.css('background', '');
                $btn.prop('disabled', false);
            }, 3000);
        }, 1500);
    });

});
