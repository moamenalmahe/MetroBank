// Image loading optimization module
const imageLoader = {
    // Options for Intersection Observer
    options: {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.1
    },

    // Device breakpoints
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        wide: 1440
    },

    // Initialize the image loader
    init() {
        this.images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.onIntersection(entries),
                this.options
            );
            
            this.images.forEach(img => {
                this.prepareResponsiveImage(img);
                this.observer.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadImagesImmediately();
        }

        // Add resize handler for responsive images
        window.addEventListener('resize', this.handleResize.bind(this));
    },

    // Handle intersection observer callback
    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    },

    // Load a single image
    loadImage(img) {
        const src = this.getOptimalImageSource(img);
        if (!src) return;

        // Load image
        img.src = src;
        
        // If there's a srcset, load that too
        const srcset = img.getAttribute('data-srcset');
        if (srcset) {
            img.srcset = srcset;
        }

        // Add loading animation class
        img.classList.add('img-loading');
        
        // Handle load completion
        img.onload = () => {
            img.classList.remove('img-loading');
            img.classList.add('img-loaded');
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
        };
    },

    // Get optimal image source based on device and screen size
    getOptimalImageSource(img) {
        const baseSrc = img.getAttribute('data-src');
        if (!baseSrc) return null;

        const width = window.innerWidth;
        const dpr = window.devicePixelRatio || 1;
        const extension = baseSrc.split('.').pop();
        const basePath = baseSrc.substring(0, baseSrc.lastIndexOf('.'));

        // Determine size suffix based on screen width
        let sizeSuffix = '';
        if (width <= this.breakpoints.mobile) {
            sizeSuffix = '-mobile';
        } else if (width <= this.breakpoints.tablet) {
            sizeSuffix = '-tablet';
        } else if (width <= this.breakpoints.desktop) {
            sizeSuffix = '-desktop';
        } else {
            sizeSuffix = '-wide';
        }

        // Add 2x suffix for high DPR devices
        if (dpr >= 2) {
            sizeSuffix += '@2x';
        }

        // Try WebP first with fallback to original format
        const webpPath = `${basePath}${sizeSuffix}.webp`;
        const originalPath = `${basePath}${sizeSuffix}.${extension}`;

        return this.supportsWebP() ? webpPath : originalPath;
    },

    // Check WebP support
    supportsWebP() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    },

    // Handle window resize
    handleResize() {
        const loadedImages = document.querySelectorAll('img.img-loaded');
        loadedImages.forEach(img => {
            const newSrc = this.getOptimalImageSource(img);
            if (newSrc && newSrc !== img.src) {
                img.src = newSrc;
            }
        });
    },

    // Prepare responsive image attributes
    prepareResponsiveImage(img) {
        const baseSrc = img.getAttribute('src') || img.getAttribute('data-src');
        if (!baseSrc) return;

        // Store original source
        img.setAttribute('data-src', baseSrc);
        
        // Create srcset for different resolutions
        const basePath = baseSrc.substring(0, baseSrc.lastIndexOf('.'));
        const extension = baseSrc.split('.').pop();
        
        const srcsetEntries = [
            `${basePath}-mobile.${extension} 480w`,
            `${basePath}-tablet.${extension} 768w`,
            `${basePath}-desktop.${extension} 1024w`,
            `${basePath}-wide.${extension} 1440w`,
            `${basePath}-mobile@2x.${extension} 960w`,
            `${basePath}-tablet@2x.${extension} 1536w`,
            `${basePath}-desktop@2x.${extension} 2048w`,
            `${basePath}-wide@2x.${extension} 2880w`
        ];

        img.setAttribute('data-srcset', srcsetEntries.join(', '));
        img.setAttribute('sizes', '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw');
        
        // Remove src to prevent immediate loading
        img.removeAttribute('src');
    },

    // Fallback for browsers that don't support Intersection Observer
    loadImagesImmediately() {
        this.images.forEach(img => {
            this.prepareResponsiveImage(img);
            this.loadImage(img);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    imageLoader.init();
});

export default imageLoader; 