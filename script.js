// Telescope Simulator - Simplified and Reliable Version
class TelescopeSimulator {
    constructor() {
        console.log('🔭 Initializing Telescope Simulator...');
        
        try {
            this.initializeElements();
            this.initializeMaterials();
            this.setupCanvas();
            this.setupEventListeners();
            this.createCosmicBackground();
            this.updateSimulation();
            
            console.log('✅ Telescope Simulator initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize simulator:', error);
            this.showError('Помилка ініціалізації симулятора');
        }
    }

    initializeElements() {
        console.log('📋 Initializing DOM elements...');
        
        this.mirrorSelect = document.getElementById('mirror-material');
        this.lensSelect = document.getElementById('lens-material');
        this.filterSelect = document.getElementById('filter-material');
        
        this.mirrorExplanation = document.getElementById('mirror-explanation');
        this.lensExplanation = document.getElementById('lens-explanation');
        this.filterExplanation = document.getElementById('filter-explanation');
        this.overallSummary = document.getElementById('overall-summary');
        this.qualityDescription = document.getElementById('quality-description');
        this.fovInfo = document.getElementById('fov-info');
        this.focusInfo = document.getElementById('focus-info');
        
        this.starViewport = document.getElementById('star-viewport');
        this.starCanvas = document.getElementById('star-canvas');
        this.transmittanceCanvas = document.getElementById('transmittance-canvas');
        
        // Zoom controls
        this.zoomSlider = document.getElementById('zoom-slider');
        this.zoomValue = document.getElementById('zoom-value');
        this.zoomReset = document.getElementById('zoom-reset');
        
        // Check if all elements exist
        const elements = [
            this.mirrorSelect, this.lensSelect, this.filterSelect,
            this.starViewport, this.starCanvas, this.transmittanceCanvas,
            this.zoomSlider, this.zoomValue, this.zoomReset
        ];
        
        for (let element of elements) {
            if (!element) {
                throw new Error('Missing required DOM element');
            }
        }
        
        console.log('✅ All DOM elements found');
    }

    initializeMaterials() {
        console.log('🔧 Initializing materials database...');
        
        this.materials = {
            mirror: {
                aluminum: {
                    name: 'Алюміній',
                    reflectivity: 0.85,
                    uvTransmission: 0.3,
                    irTransmission: 0.7,
                    quality: 0.7,
                    brightness: 0.85,
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Алюміній забезпечує хорошу відбивну здатність у видимому спектрі (85%), але погано працює в ультрафіолетовому та інфрачервоному діапазонах.'
                },
                silver: {
                    name: 'Срібло',
                    reflectivity: 0.95,
                    uvTransmission: 0.6,
                    irTransmission: 0.95,
                    quality: 0.9,
                    brightness: 1.2,
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Срібло має найвищу відбивну здатність (95%), дає дуже яскраве зображення, але схильне до окислення без спеціального покриття.'
                },
                glass: {
                    name: 'Поліровне скло',
                    reflectivity: 0.70,
                    uvTransmission: 0.8,
                    irTransmission: 0.8,
                    quality: 0.8,
                    brightness: 0.7,
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Дає стабільне зображення з відбивною здатністю 70%, але значно гірше відбиває світло, що призводить до приглушеного зображення.'
                },
                gold: {
                    name: 'Золото',
                    reflectivity: 0.85,
                    uvTransmission: 0.1,
                    irTransmission: 0.98,
                    quality: 0.6,
                    brightness: 0.8,
                    colorShift: { r: 1.3, g: 1.1, b: 0.7 },
                    explanation: 'Добре відбиває ІЧ випромінювання (85% лише в інфрачервоному), але слабке для видимого світла. Дає теплий золотистий колір.'
                },
                dielectric: {
                    name: 'Діелектричне покриття',
                    reflectivity: 0.99,
                    uvTransmission: 0.95,
                    irTransmission: 0.95,
                    quality: 0.95,
                    brightness: 1.4,
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Оптимізоване багатошарове покриття з відбивною здатністю 99% для максимальної ефективності. Забезпечує високу контрастність.'
                },
                rough: {
                    name: 'Грубе дзеркало',
                    reflectivity: 0.60,
                    uvTransmission: 0.4,
                    irTransmission: 0.5,
                    quality: 0.2,
                    brightness: 0.6,
                    colorShift: { r: 0.9, g: 0.9, b: 0.9 },
                    explanation: 'Мікродефекти поверхні призводять до сильного розсіювання світла. Відбивна здатність ~60%, створює розмите, мильне зображення.'
                }
            },
            lens: {
                plastic: {
                    name: 'Пластик',
                    transmission: 0.85,
                    aberration: 0.8,
                    quality: 0.4,
                    fov: 2.5,
                    focus: 'Розфокусований',
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Дешевий матеріал з високою хроматичною аберацією (80%), сильно спотворює зображення та створює райдужність.'
                },
                glass: {
                    name: 'Скло (Soda-lime)',
                    transmission: 0.92,
                    aberration: 0.4,
                    quality: 0.7,
                    fov: 2.0,
                    focus: 'Хороший',
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Стандартне скло з середніми спотвореннями (40% аберації), створює легке розмиття зображення.'
                },
                fluorite: {
                    name: 'Флуорит',
                    transmission: 0.98,
                    aberration: 0.1,
                    quality: 0.95,
                    fov: 1.8,
                    focus: 'Ідеальний',
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Високоякісний матеріал із мінімальними абераціями (10%), ідеальний для астрономії. Дає дуже чітке зображення.'
                },
                quartz: {
                    name: 'Кварц',
                    transmission: 0.95,
                    aberration: 0.2,
                    quality: 0.85,
                    fov: 1.9,
                    focus: 'Відмінний',
                    colorShift: { r: 0.95, g: 0.98, b: 1.1 },
                    explanation: 'Добре пропускає ультрафіолет (95%), менш схильний до спотворень (20% аберації). Висока яскравість у UV діапазоні.'
                },
                astro: {
                    name: 'Астрофізичне скло',
                    transmission: 0.99,
                    aberration: 0.05,
                    quality: 0.98,
                    fov: 1.7,
                    focus: 'Ідеально різкий',
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Спеціально розроблене скло для телескопів з мінімальними спотвореннями (5%). Забезпечує ідеально різке зображення.'
                },
                fisheye: {
                    name: 'Радіальне скло',
                    transmission: 0.88,
                    aberration: 0.6,
                    quality: 0.5,
                    fov: 3.5,
                    focus: 'Викривлений',
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Створює ефект "риб\'яче око" з викривленням по краях. Змінна аберація, підходить для демонстрації оптичних спотворень.'
                }
            },
            filter: {
                clear: {
                    name: 'Прозорий',
                    uvTransmission: 1.0,
                    visibleTransmission: 1.0,
                    irTransmission: 1.0,
                    quality: 1.0,
                    colorShift: { r: 1.0, g: 1.0, b: 1.0 },
                    explanation: 'Пропускає повний спектр, нейтральний фільтр. Нічого не змінює в зображенні.'
                },
                uv: {
                    name: 'UV-фільтр',
                    uvTransmission: 0.1,
                    visibleTransmission: 0.95,
                    irTransmission: 1.0,
                    quality: 0.9,
                    colorShift: { r: 0.9, g: 0.95, b: 0.85 },
                    explanation: 'Блокує до 90% ультрафіолету, покращує контрастність та зменшує яскравість в UV діапазоні.'
                },
                ir: {
                    name: 'ІЧ-фільтр',
                    uvTransmission: 0.1,
                    visibleTransmission: 0.2,
                    irTransmission: 0.9,
                    quality: 0.7,
                    colorShift: { r: 0.3, g: 0.4, b: 1.0 },
                    explanation: 'Блокує інфрачервоне випромінювання, прибирає теплі тони та зменшує "червоність" зображення.'
                },
                blue: {
                    name: 'Синій фільтр',
                    uvTransmission: 0.8,
                    visibleTransmission: 0.3,
                    irTransmission: 0.1,
                    quality: 0.8,
                    colorShift: { r: 0.2, g: 0.4, b: 1.5 },
                    explanation: 'Пропускає лише короткохвильове світло (450 нм), все здається синім. Підкреслює гарячі зорі.'
                },
                red: {
                    name: 'Червоний фільтр',
                    uvTransmission: 0.1,
                    visibleTransmission: 0.4,
                    irTransmission: 0.9,
                    quality: 0.8,
                    colorShift: { r: 1.8, g: 0.3, b: 0.2 },
                    explanation: 'Пропускає лише довгохвильове світло (650 нм), створює тепле червоне зображення. Холодні об\'єкти стають темними.'
                },
                nd: {
                    name: 'Нейтральна щільність (ND)',
                    uvTransmission: 0.5,
                    visibleTransmission: 0.5,
                    irTransmission: 0.5,
                    quality: 0.9,
                    colorShift: { r: 0.8, g: 0.8, b: 0.8 },
                    explanation: 'Рівномірно зменшує яскравість у всіх діапазонах, не змінюючи кольору. Загальне затемнення зображення.'
                },
                polarizing: {
                    name: 'Поляризаційний',
                    uvTransmission: 0.7,
                    visibleTransmission: 0.6,
                    irTransmission: 0.7,
                    quality: 0.85,
                    colorShift: { r: 0.9, g: 0.9, b: 0.9 },
                    explanation: 'Покращує контрастність та блокує відблиски. Зменшує відбиття від поверхонь та підвищує чіткість деталей.'
                }
            }
        };
        
        console.log('✅ Materials database loaded with', 
            Object.keys(this.materials.mirror).length, 'mirrors,',
            Object.keys(this.materials.lens).length, 'lenses,',
            Object.keys(this.materials.filter).length, 'filters');
    }

    setupCanvas() {
        console.log('🎨 Setting up canvas...');
        
        try {
            // Setup star canvas
            this.starCanvas.width = 300;
            this.starCanvas.height = 300;
            this.starCtx = this.starCanvas.getContext('2d');
            
            if (!this.starCtx) {
                throw new Error('Failed to get 2D context for star canvas');
            }
            
            // Setup transmittance canvas
            this.transmittanceCanvas.width = 400;
            this.transmittanceCanvas.height = 300;
            this.transmittanceCtx = this.transmittanceCanvas.getContext('2d');
            
            if (!this.transmittanceCtx) {
                throw new Error('Failed to get 2D context for transmittance canvas');
            }
            
            // Initialize zoom
            this.zoomLevel = 1.0;
            this.setupZoomControls();
            
            // Show loading message
            this.showLoadingMessage();
            
            console.log('✅ Canvas setup complete');
            
        } catch (error) {
            console.error('❌ Canvas setup failed:', error);
            throw error;
        }
    }

    showLoadingMessage() {
        const ctx = this.starCtx;
        
        // Clear and set background
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, 300, 300);
        
        // Show loading text
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Завантаження...', 150, 140);
        ctx.fillText('Симулятор зірки', 150, 160);
        
        console.log('📺 Loading message displayed');
    }

    showError(message) {
        const ctx = this.starCtx;
        if (!ctx) return;
        
        ctx.fillStyle = '#220000';
        ctx.fillRect(0, 0, 300, 300);
        
        ctx.fillStyle = '#ff6666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Помилка:', 150, 140);
        ctx.fillText(message, 150, 160);
    }

    setupZoomControls() {
        console.log('🔍 Setting up zoom controls...');
        
        // Load saved zoom level
        const savedZoom = localStorage.getItem('telescopeZoom');
        if (savedZoom) {
            this.zoomLevel = parseFloat(savedZoom);
            this.zoomSlider.value = this.zoomLevel.toString();
        }
        
        // Update zoom display and apply initial zoom
        this.updateZoomDisplay();
        this.applyZoom();
        
        // Zoom slider event
        this.zoomSlider.addEventListener('input', (e) => {
            this.zoomLevel = parseFloat(e.target.value);
            this.updateZoomDisplay();
            this.applyZoom();
            this.saveZoomLevel();
            console.log(`Zoom changed to: ${(this.zoomLevel * 100).toFixed(0)}%`);
        });
        
        // Reset button
        this.zoomReset.addEventListener('click', () => {
            this.zoomLevel = 1.0;
            this.zoomSlider.value = '1';
            this.updateZoomDisplay();
            this.applyZoom();
            this.saveZoomLevel();
            console.log('Zoom reset to 100%');
        });
        
        // Mouse wheel zoom
        this.starViewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
            const newZoom = Math.max(0.5, Math.min(3.0, this.zoomLevel + zoomDelta));
            
            if (newZoom !== this.zoomLevel) {
                this.zoomLevel = newZoom;
                this.zoomSlider.value = this.zoomLevel.toString();
                this.updateZoomDisplay();
                this.applyZoom();
                this.saveZoomLevel();
                console.log(`Mouse wheel zoom: ${(this.zoomLevel * 100).toFixed(0)}%`);
            }
        });
        
        console.log('✅ Zoom controls ready');
    }

    saveZoomLevel() {
        localStorage.setItem('telescopeZoom', this.zoomLevel.toString());
    }

    updateZoomDisplay() {
        const percentage = Math.round(this.zoomLevel * 100);
        this.zoomValue.textContent = `${percentage}%`;
    }

    applyZoom() {
        // Apply CSS transform to scale the canvas
        this.starCanvas.style.transform = `scale(${this.zoomLevel})`;
        
        // Adjust viewport if needed for large zoom levels
        if (this.zoomLevel > 1.5) {
            this.starViewport.style.overflow = 'auto';
        } else {
            this.starViewport.style.overflow = 'hidden';
        }
    }

    setupEventListeners() {
        console.log('👂 Setting up event listeners...');
        
        this.mirrorSelect.addEventListener('change', () => {
            console.log('Mirror changed to:', this.mirrorSelect.value);
            this.updateSimulation();
        });
        
        this.lensSelect.addEventListener('change', () => {
            console.log('Lens changed to:', this.lensSelect.value);
            this.updateSimulation();
        });
        
        this.filterSelect.addEventListener('change', () => {
            console.log('Filter changed to:', this.filterSelect.value);
            this.updateSimulation();
        });
        
        console.log('✅ Event listeners ready');
    }

    getCurrentConfiguration() {
        return {
            mirror: this.materials.mirror[this.mirrorSelect.value],
            lens: this.materials.lens[this.lensSelect.value],
            filter: this.materials.filter[this.filterSelect.value]
        };
    }

    calculateOverallQuality(config) {
        const mirrorWeight = 0.4;
        const lensWeight = 0.4;
        const filterWeight = 0.2;
        
        return mirrorWeight * config.mirror.quality + 
               lensWeight * config.lens.quality + 
               filterWeight * config.filter.quality;
    }

    updateSimulation() {
        console.log('🔄 Updating simulation...');
        
        try {
            const config = this.getCurrentConfiguration();
            
            this.updateExplanations(config);
            this.renderStarImage(config);
            this.updateTechnicalInfo(config);
            this.renderTransmittanceGraph(config);
            this.updateOverallSummary(config);
            
            console.log('✅ Simulation updated successfully');
            
        } catch (error) {
            console.error('❌ Simulation update failed:', error);
            this.showError('Помилка оновлення');
        }
    }

    updateExplanations(config) {
        this.mirrorExplanation.textContent = config.mirror.explanation;
        this.lensExplanation.textContent = config.lens.explanation;
        this.filterExplanation.textContent = config.filter.explanation;
    }

    updateTechnicalInfo(config) {
        this.fovInfo.textContent = `Поле зору: ${config.lens.fov}°`;
        this.focusInfo.textContent = `Фокус: ${config.lens.focus}`;
        
        const quality = this.calculateOverallQuality(config);
        this.updateQualityDescription(quality);
    }

    updateQualityDescription(quality) {
        let qualityText, qualityClass;
        
        if (quality >= 0.85) {
            qualityText = 'Якість зображення: Відмінна';
            qualityClass = 'quality-excellent';
        } else if (quality >= 0.7) {
            qualityText = 'Якість зображення: Хороша';
            qualityClass = 'quality-good';
        } else if (quality >= 0.5) {
            qualityText = 'Якість зображення: Середня';
            qualityClass = 'quality-average';
        } else {
            qualityText = 'Якість зображення: Низька';
            qualityClass = 'quality-poor';
        }
        
        this.qualityDescription.textContent = qualityText;
        this.qualityDescription.className = qualityClass;
    }

    renderStarImage(config) {
        console.log('⭐ Rendering star image...');
        
        try {
            const ctx = this.starCtx;
            const canvas = this.starCanvas;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Clear canvas with dark space background
            ctx.fillStyle = '#000011';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add background stars
            this.drawBackgroundStars(ctx);
            
            // Calculate star properties
            const quality = this.calculateOverallQuality(config);
            const brightness = config.mirror.brightness * config.lens.transmission * config.filter.visibleTransmission;
            const aberration = config.lens.aberration;
            
            // Apply combined color effects from mirror and filter
            const mirrorColor = config.mirror.colorShift || { r: 1.0, g: 1.0, b: 1.0 };
            const filterColor = config.filter.colorShift;
            
            const red = Math.round(255 * brightness * mirrorColor.r * filterColor.r);
            const green = Math.round(255 * brightness * mirrorColor.g * filterColor.g);
            const blue = Math.round(255 * brightness * mirrorColor.b * filterColor.b);
            
            // Main star size based on quality
            let starRadius = 25 + (1 - quality) * 15; // Larger = worse quality
            
            // Special effects for different materials
            if (config.mirror.name === 'Грубе дзеркало') {
                this.drawRoughMirrorEffect(ctx, centerX, centerY, starRadius * 1.5, red, green, blue, brightness);
            } else if (config.lens.name === 'Радіальне скло') {
                this.drawFisheyeEffect(ctx, centerX, centerY, starRadius, red, green, blue, brightness);
            } else {
                // Normal star rendering
                this.drawMainStar(ctx, centerX, centerY, starRadius, red, green, blue, brightness);
                
                // Add chromatic aberration for poor quality lenses
                if (aberration > 0.3) {
                    this.drawChromaticAberration(ctx, centerX, centerY, starRadius, aberration);
                }
                
                // Add diffraction spikes for good quality (but not for rough mirror)
                if (quality > 0.7 && config.mirror.name !== 'Грубе дзеркало') {
                    this.drawDiffractionSpikes(ctx, centerX, centerY, brightness, red, green, blue);
                }
                
                // Special enhancement for dielectric coating
                if (config.mirror.name === 'Діелектричне покриття') {
                    this.drawDielectricEnhancement(ctx, centerX, centerY, starRadius, red, green, blue, brightness);
                }
            }
            
            console.log(`✅ Star rendered - Quality: ${(quality*100).toFixed(1)}%, Brightness: ${(brightness*100).toFixed(1)}%`);
            
        } catch (error) {
            console.error('❌ Star rendering failed:', error);
            this.showError('Помилка відображення зірки');
        }
    }

    drawBackgroundStars(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        // Fixed background stars for consistency
        const stars = [
            {x: 50, y: 50, size: 1}, {x: 100, y: 30, size: 0.5}, {x: 250, y: 80, size: 1.2},
            {x: 280, y: 150, size: 0.8}, {x: 200, y: 200, size: 1}, {x: 80, y: 180, size: 0.7},
            {x: 220, y: 50, size: 0.9}, {x: 30, y: 250, size: 1.1}, {x: 270, y: 270, size: 0.6}
        ];
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawMainStar(ctx, centerX, centerY, radius, red, green, blue, brightness) {
        // Create radial gradient for star glow
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, `rgb(${red}, ${green}, ${blue})`);
        gradient.addColorStop(0.3, `rgba(${red}, ${green}, ${blue}, ${brightness * 0.8})`);
        gradient.addColorStop(0.7, `rgba(${red}, ${green}, ${blue}, ${brightness * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add bright core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.3);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
        coreGradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, ${brightness * 0.5})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawChromaticAberration(ctx, centerX, centerY, radius, aberration) {
        const offset = aberration * 6;
        
        // Red fringe
        ctx.fillStyle = `rgba(255, 0, 0, ${aberration * 0.4})`;
        ctx.beginPath();
        ctx.arc(centerX + offset, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Blue fringe
        ctx.fillStyle = `rgba(0, 100, 255, ${aberration * 0.4})`;
        ctx.beginPath();
        ctx.arc(centerX - offset, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
    }

    drawDiffractionSpikes(ctx, centerX, centerY, brightness, red, green, blue) {
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${brightness * 0.8})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        const spikeLength = 60;
        
        // Vertical spike
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - spikeLength);
        ctx.lineTo(centerX, centerY + spikeLength);
        ctx.stroke();
        
        // Horizontal spike  
        ctx.beginPath();
        ctx.moveTo(centerX - spikeLength, centerY);
        ctx.lineTo(centerX + spikeLength, centerY);
        ctx.stroke();
        
        // Diagonal spikes (fainter)
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${brightness * 0.4})`;
        ctx.lineWidth = 1;
        
        const diagLength = 40;
        
        // Diagonal 1
        ctx.beginPath();
        ctx.moveTo(centerX - diagLength * 0.7, centerY - diagLength * 0.7);
        ctx.lineTo(centerX + diagLength * 0.7, centerY + diagLength * 0.7);
        ctx.stroke();
        
        // Diagonal 2
        ctx.beginPath();
        ctx.moveTo(centerX - diagLength * 0.7, centerY + diagLength * 0.7);
        ctx.lineTo(centerX + diagLength * 0.7, centerY - diagLength * 0.7);
        ctx.stroke();
    }

    drawRoughMirrorEffect(ctx, centerX, centerY, radius, red, green, blue, brightness) {
        // Multiple scattered light sources for rough mirror
        const scatterCount = 8;
        
        for (let i = 0; i < scatterCount; i++) {
            const angle = (i / scatterCount) * Math.PI * 2;
            const distance = 15 + Math.random() * 20;
            const scatterX = centerX + Math.cos(angle) * distance;
            const scatterY = centerY + Math.sin(angle) * distance;
            const scatterRadius = radius * 0.3 + Math.random() * 10;
            
            const gradient = ctx.createRadialGradient(scatterX, scatterY, 0, scatterX, scatterY, scatterRadius);
            gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${brightness * 0.3})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(scatterX, scatterY, scatterRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Central diffused glow
        this.drawMainStar(ctx, centerX, centerY, radius * 0.8, red * 0.8, green * 0.8, blue * 0.8, brightness * 0.7);
    }

    drawFisheyeEffect(ctx, centerX, centerY, radius, red, green, blue, brightness) {
        // Central star
        this.drawMainStar(ctx, centerX, centerY, radius * 0.6, red, green, blue, brightness);
        
        // Concentric distortion rings
        for (let ring = 1; ring <= 4; ring++) {
            const ringRadius = radius * 0.8 + ring * 25;
            const ringOpacity = brightness * 0.1 / ring;
            
            ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${ringOpacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Edge distortion effect
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${brightness * 0.2})`;
        ctx.lineWidth = 1;
        const edgeRadius = radius + 60;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const startX = centerX + Math.cos(angle) * edgeRadius;
            const startY = centerY + Math.sin(angle) * edgeRadius;
            const endX = centerX + Math.cos(angle) * (edgeRadius + 20);
            const endY = centerY + Math.sin(angle) * (edgeRadius + 20);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    drawDielectricEnhancement(ctx, centerX, centerY, radius, red, green, blue, brightness) {
        // Enhanced diffraction spikes for dielectric coating
        const enhancedBrightness = brightness * 1.3;
        
        // Primary spikes (brighter and longer)
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${enhancedBrightness})`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        const primaryLength = 80;
        
        // Vertical spike
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - primaryLength);
        ctx.lineTo(centerX, centerY + primaryLength);
        ctx.stroke();
        
        // Horizontal spike  
        ctx.beginPath();
        ctx.moveTo(centerX - primaryLength, centerY);
        ctx.lineTo(centerX + primaryLength, centerY);
        ctx.stroke();
        
        // Secondary cross pattern
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${enhancedBrightness * 0.6})`;
        ctx.lineWidth = 2;
        
        const secondaryLength = 50;
        const angles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
        
        angles.forEach(angle => {
            const startX = centerX + Math.cos(angle) * 10;
            const startY = centerY + Math.sin(angle) * 10;
            const endX = centerX + Math.cos(angle) * secondaryLength;
            const endY = centerY + Math.sin(angle) * secondaryLength;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        });
        
        // Enhanced central glow
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2);
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${enhancedBrightness})`);
        glowGradient.addColorStop(0.3, `rgba(${red}, ${green}, ${blue}, ${enhancedBrightness * 0.8})`);
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    renderTransmittanceGraph(config) {
        console.log('📊 Rendering transmittance graph...');
        
        try {
            const ctx = this.transmittanceCtx;
            const canvas = this.transmittanceCanvas;
            const width = canvas.width;
            const height = canvas.height;
            const padding = 40;
            
            // Clear canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            
            // Draw grid and axes
            this.drawGraphGrid(ctx, width, height, padding);
            
            // Calculate transmittance data
            const wavelengths = [];
            const transmittance = [];
            
            for (let wavelength = 300; wavelength <= 800; wavelength += 10) {
                wavelengths.push(wavelength);
                
                let trans = 1.0;
                
                // Mirror reflectivity effect
                if (wavelength < 400) { // UV range
                    trans *= config.mirror.uvTransmission;
                } else if (wavelength > 700) { // IR range
                    trans *= config.mirror.irTransmission;
                } else { // Visible range
                    trans *= config.mirror.reflectivity;
                }
                
                // Lens transmission
                trans *= config.lens.transmission;
                
                // Filter effects
                if (wavelength < 400) { // UV
                    trans *= config.filter.uvTransmission;
                } else if (wavelength > 700) { // IR
                    trans *= config.filter.irTransmission;
                } else { // Visible
                    trans *= config.filter.visibleTransmission;
                }
                
                transmittance.push(trans * 100); // Convert to percentage
            }
            
            // Draw transmittance curve
            this.drawTransmittanceCurve(ctx, wavelengths, transmittance, width, height, padding);
            
            // Add labels
            this.drawGraphLabels(ctx, width, height, padding);
            
            console.log('✅ Transmittance graph rendered');
            
        } catch (error) {
            console.error('❌ Graph rendering failed:', error);
        }
    }

    drawGraphGrid(ctx, width, height, padding) {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Vertical grid lines (wavelength)
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * (width - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Horizontal grid lines (transmittance)
        for (let i = 0; i <= 10; i++) {
            const y = padding + (i / 10) * (height - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Axes
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
    }

    drawTransmittanceCurve(ctx, wavelengths, transmittance, width, height, padding) {
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < wavelengths.length; i++) {
            const x = padding + ((wavelengths[i] - 300) / 500) * (width - 2 * padding);
            const y = height - padding - (transmittance[i] / 100) * (height - 2 * padding);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Fill under curve
        ctx.fillStyle = 'rgba(33, 150, 243, 0.2)';
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fill();
    }

    drawGraphLabels(ctx, width, height, padding) {
        ctx.fillStyle = '#333333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // X-axis labels (wavelength)
        for (let i = 0; i <= 5; i++) {
            const wavelength = 300 + i * 100;
            const x = padding + (i / 5) * (width - 2 * padding);
            ctx.fillText(wavelength + 'нм', x, height - 10);
        }
        
        // Y-axis labels (transmittance)
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const percent = i * 20;
            const y = height - padding - (i / 5) * (height - 2 * padding) + 5;
            ctx.fillText(percent + '%', padding - 10, y);
        }
    }

    updateOverallSummary(config) {
        const quality = this.calculateOverallQuality(config);
        const brightness = config.mirror.brightness * config.lens.transmission * config.filter.visibleTransmission;
        
        let summary = `<p><strong>Поточна конфігурація:</strong></p>`;
        summary += `<p>• Дзеркало: ${config.mirror.name}</p>`;
        summary += `<p>• Лінза: ${config.lens.name}</p>`;
        summary += `<p>• Фільтр: ${config.filter.name}</p>`;
        summary += `<br>`;
        summary += `<p><strong>Результати:</strong></p>`;
        summary += `<p>• Загальна якість: ${(quality * 100).toFixed(1)}%</p>`;
        summary += `<p>• Яскравість зображення: ${(brightness * 100).toFixed(1)}%</p>`;
        summary += `<p>• Поле зору: ${config.lens.fov}°</p>`;
        summary += `<p>• Масштаб: ${(this.zoomLevel * 100).toFixed(0)}%</p>`;
        summary += `<p>• Режим: 2D Canvas</p>`;
        
        if (quality >= 0.8) {
            summary += `<p>• <span style="color: #00ff00;">Відмінна конфігурація для високоякісних спостережень</span></p>`;
        } else if (quality >= 0.6) {
            summary += `<p>• <span style="color: #ffff00;">Хороша конфігурація для загальних спостережень</span></p>`;
        } else {
            summary += `<p>• <span style="color: #ff6b6b;">Конфігурація має обмеження в якості зображення</span></p>`;
        }
        
        this.overallSummary.innerHTML = summary;
    }

    createCosmicBackground() {
        console.log('🌌 Creating cosmic background...');
        
        // Create floating particles
        this.createFloatingParticles();
        
        // Add shooting stars occasionally
        this.startShootingStars();
        
        console.log('✅ Cosmic background created');
    }

    createFloatingParticles() {
        const particlesContainer = document.querySelector('.cosmic-particles');
        const particleCount = 15; // Number of floating particles
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random initial position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 15 + 's';
            
            // Random size variation
            const size = 1 + Math.random() * 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random opacity
            particle.style.opacity = 0.3 + Math.random() * 0.7;
            
            particlesContainer.appendChild(particle);
        }
    }

    startShootingStars() {
        setInterval(() => {
            this.createShootingStar();
        }, 8000 + Math.random() * 12000); // Random interval between 8-20 seconds
    }

    createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #fff, #87ceeb);
            border-radius: 50%;
            box-shadow: 0 0 10px #fff, 0 0 20px #87ceeb, 0 0 30px #87ceeb;
            z-index: -1;
            pointer-events: none;
        `;
        
        // Random starting position (top area)
        const startX = Math.random() * window.innerWidth;
        const startY = -10;
        
        shootingStar.style.left = startX + 'px';
        shootingStar.style.top = startY + 'px';
        
        document.body.appendChild(shootingStar);
        
        // Animate shooting star
        const endX = startX + 200 + Math.random() * 300;
        const endY = window.innerHeight + 100;
        
        shootingStar.animate([
            {
                transform: `translate(0, 0) scale(1)`,
                opacity: 0
            },
            {
                transform: `translate(${(endX - startX) * 0.2}px, ${(endY - startY) * 0.2}px) scale(1.5)`,
                opacity: 1,
                offset: 0.2
            },
            {
                transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.5)`,
                opacity: 0
            }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            document.body.removeChild(shootingStar);
        };
        
        console.log('💫 Shooting star created');
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, starting telescope simulator...');
    
    // Small delay to ensure everything is ready
    setTimeout(() => {
        try {
            window.telescopeSimulator = new TelescopeSimulator();
        } catch (error) {
            console.error('💥 Critical error initializing simulator:', error);
            
            // Emergency fallback
            const viewport = document.getElementById('star-viewport');
            if (viewport) {
                viewport.innerHTML = '<div style="color: red; text-align: center; padding: 50px;">Критична помилка завантаження симулятора.<br>Перевірте консоль браузера (F12) для деталей.</div>';
            }
        }
    }, 250);
}); 
