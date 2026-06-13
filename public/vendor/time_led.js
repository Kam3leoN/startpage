"use strict";

// LED Display Module with SVG
if (typeof ident === "undefined") {
    var ident = {};
}

ident.Led = function(conf) {
    // Configuration variables
    let font,
        timer,
        // Three simple fonts for digits 0-9, colon (:), and space ( )
        font1 = [
            " 000    0    000   000     0  00000   00  00000  000   000             ",
            "0   0  00   0   0 0   0   00  0      0        0 0   0 0   0            ",
            "0   0   0       0     0  0 0  0     0         0 0   0 0   0   0        ",
            "0   0   0    000   000  0  0  0000  0000     0   000   0000            ",
            "0   0   0   0         0 00000     0 0   0   0   0   0     0            ",
            "0   0   0   0     0   0    0  0   0 0   0  0    0   0    0    0        ",
            " 000   000  00000  000     0   000   000  0      000   00              "
        ],
        font2 = [
            " 000    0    000  00000    0  00000   00  00000  000   000             ",
            "0   0  00   0   0    0    00  0      0        0 0   0 0   0            ",
            "0  00   0       0   0    0 0  0000  0        0  0   0 0   0   0        ",
            "0 0 0   0     00     0  0  0      0 0000    0    000   0000            ",
            "00  0   0    0        0 00000     0 0   0   0   0   0     0            ",
            "0   0   0   0     0   0    0  0   0 0   0   0   0   0    0    0        ",
            " 000   000  00000  000     0   000   000    0    000   00              "
        ],
        font3 = [
            "00000     0 00000 00000 0   0 00000 00000 00000 00000 00000            ",
            "0   0     0     0     0 0   0 0     0         0 0   0 0   0            ",
            "0   0     0     0     0 0   0 0     0         0 0   0 0   0   0        ",
            "0   0     0 00000 00000 00000 00000 00000     0 00000 00000            ",
            "0   0     0 0         0     0     0 0   0     0 0   0     0   0        ",
            "0   0     0 0         0     0     0 0   0     0 0   0     0            ",
            "00000     0 00000 00000     0 00000 00000     0 00000 00000            "
        ],
        m_d = 0, m_h = 0, m_m = 0, m_s = 0,
        time_rem,
        new_date,
        razd,
        dig = [],
        d,
        i,
        rand_num,
        num,
        flash_dot = true;

    /** Slot width per format character (digits = 6 cols, colons = 4 when compact). */
    var slotStarts = [];
    var totalLedCols = 0;

    function formatSlotCols(formatChar) {
        if (compact_colon && formatChar === ":") return 4;
        return 6;
    }

    function charSlot(ch) {
        if (compact_colon && (ch === ":" || ch === " ")) return { cols: 4, skip: 1 };
        return { cols: 6, skip: 0 };
    }

    function buildSlotLayout(template) {
        slotStarts = [];
        totalLedCols = 0;
        for (let l = 0; l < template.length; l++) {
            slotStarts[l] = totalLedCols;
            totalLedCols += formatSlotCols(template.charAt(l));
        }
    }

    /** Sets SVG dimensions + viewBox for lossless CSS scaling. */
    function setSvgSize() {
        const svgW = totalLedCols * (h_w + pix_between) - (h_w + 2 * pix_between);
        const svgH = 7 * (h_w + pix_between) - pix_between;
        svg.setAttribute("width", String(svgW));
        svg.setAttribute("height", String(svgH));
        svg.setAttribute("viewBox", "0 0 " + svgW + " " + svgH);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("overflow", "visible");
    }

    function initLedGrid(colCount) {
        for (i = 0; i < colCount; i++) {
            dig[i] = [];
            for (let y = 0; y < 7; y++) {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute('x', i * (h_w + pix_between));
                rect.setAttribute('y', y * (h_w + pix_between));
                rect.setAttribute('width', h_w);
                rect.setAttribute('height', h_w);
                rect.setAttribute('rx', rounded);
                rect.setAttribute('ry', rounded);
                rect.setAttribute('fill', bgcolor);
                rect.setAttribute('opacity', bgvisible);
                rect.classList.add('led-segment');
                svg.appendChild(rect);
                dig[i][y] = rect;
            }
        }
    }

    // Default configuration values
    const id = conf.id === undefined ? "ledtime" : conf.id;
    const type = conf.type === undefined ? "time" : conf.type;
    const format = conf.format === undefined ? "hh:mm:ss" : conf.format;
    const color = conf.color === undefined ? "#fff" : conf.color;
    const bgcolor = conf.bgcolor === undefined ? "#000" : conf.bgcolor;
    const bgvisible = parseFloat(conf.bgvisible === undefined ? 1 : conf.bgvisible);
    const rounded = conf.rounded === undefined ? 4 : conf.rounded;
    const pix_between = conf.pix_between === undefined ? 1 : conf.pix_between;
    const hourformat = conf.hourformat === undefined ? 24 : conf.hourformat;
    const n_length = conf.length === undefined ? 8 : conf.length;
    const h_w = conf.size === undefined ? 16 : parseInt(conf.size);
    const compact_colon = conf.compact_colon === undefined ? true : !!conf.compact_colon;
    const rnum = conf.num === undefined ? "0,9999999" : conf.num;
    const time_zone = conf.time_zone === undefined ? undefined : parseInt(conf.time_zone);

    // Select font based on configuration
    if (conf.font === "font1") {
        font = font1;
    } else if (conf.font === "font2") {
        font = font2;
    } else {
        font = font3;
    }

    // Parse time string into components
    function mtimer(timer, m) {
        const n_t = timer.split(":");
        for (i = 0; i < n_t.length; i++) {
            n_t[i] = parseInt(n_t[i], 10);
        }
        return n_t;
    }

    // Create SVG element
    const container = document.getElementById(id);
    container.innerHTML = ''; // Clear container
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    container.appendChild(svg);

    // Add CSS styles for animations
    const style = document.createElement('style');
    style.textContent = `
        .led-segment {
            transition: fill 0.3s ease, opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Initialize display based on type
    if (type === "random") {
        // Set SVG dimensions for random number display
        svg.setAttribute('width', n_length * 6 * (h_w + pix_between) - (h_w + 2 * pix_between));
        svg.setAttribute('height', 7 * (h_w + pix_between) - pix_between);
        
        // Initialize digit array with SVG elements
        for (i = 0; i < n_length * 6; i++) {
            dig[i] = [];
            for (let y = 0; y < 7; y++) {
                // Create SVG rectangle
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute('x', i * (h_w + pix_between));
                rect.setAttribute('y', y * (h_w + pix_between));
                rect.setAttribute('width', h_w);
                rect.setAttribute('height', h_w);
                rect.setAttribute('rx', rounded);
                rect.setAttribute('ry', rounded);
                rect.setAttribute('fill', bgcolor);
                rect.setAttribute('opacity', bgvisible);
                rect.classList.add('led-segment');
                svg.appendChild(rect);
                
                // Store reference to SVG element
                dig[i][y] = rect;
            }
        }
        updateLedRandom();
    } else {
        buildSlotLayout(format);
        setSvgSize();
    }

    // Initialize countdown display
    if (type === "countdown") {
        const n_t = mtimer(conf.timer);
        new_date = new Date(n_t[0], n_t[1] - 1, n_t[2], n_t[3], n_t[4]);
        
        // Determine digit count based on format
        const digitCount = format.length;
        buildSlotLayout(format);
        initLedGrid(totalLedCols);
        updateTime();
    }

    // Initialize time display
    if (type === "time") {
        buildSlotLayout(format);
        initLedGrid(totalLedCols);
        updateTime();
    }

    // Main update function for time-based displays
    function updateTime() {
        d = new Date(new Date().getTime());
        if (time_zone !== undefined) {
            d = new Date(new Date().getTime() - (3600000 * (d.getHours() - d.getUTCHours() - time_zone)));
        }
        
        if (type === "countdown") {
            updateLedCountdown(d);
        } else if (type === "time") {
            updateLedTime(d);
        }
        
        // Schedule next update
        setTimeout(updateTime, 1000);
    }

    // Update display with random number
    function updateLedRandom() {
        rand_num = rnum.split(",").map((v) => +v);
        if(rand_num.length === 2){
            num = rand_num[0] + Math.floor(Math.random()*(rand_num[1]-rand_num[0]));
        } else if (rand_num.length === 1) {
            num = parseInt(rand_num[0]);
        }
        
        // Pad with leading zeros if needed
        while (String(num).length < n_length) {
            num = "0" + num;
        }
        
        dig_to_led("" + num);
    }

    // Update countdown display
    function updateLedCountdown(d) {
        time_rem = parseInt((new_date.getTime() - d.getTime()) / 1000) + 1;
        m_d = parseInt(time_rem / 86400);
        m_h = parseInt((time_rem - m_d * 86400) / 3600);
        m_m = parseInt((time_rem - m_d * 86400 - m_h * 3600) / 60);
        m_s = parseInt(time_rem - m_d * 86400 - m_h * 3600 - m_m * 60);
        
        // Format the countdown string
        num = (m_d < 10 ? "00" : (m_d > 100 ? "" : "0")) + m_d + ":" + 
              (m_h < 10 ? "0" : "") + m_h + ":" + 
              (m_m < 10 ? "0" : "") + m_m + ":" + 
              (m_s < 10 ? "0" : "") + m_s;
        
        const ar_num = num.split(":");
        let num2 = '';

        if ((new_date.getTime() - d.getTime()) >= 0) {
            // Format based on display configuration
            const f = format.split(':');

            f.forEach((v, i) => {
                if (i !== 0) {
                    num2 += ':';
                }
                switch (v) {
                    case 'ddd':
                        num2 += ar_num[0];
                        break;
                    case 'hh':
                        num2 += ar_num[1];
                        break;
                    case 'mm':
                        num2 += ar_num[2];
                        break;
                        break;
                    case 'ss':
                        num2 += ar_num[3];
                        break;
                }
            });
            dig_to_led(num2);
        } else {
            // Countdown finished
            dig_to_led("000:00:00:00");
        }
    }

    // Update time display
    function updateLedTime(d) {
        m_h = parseInt(d.getHours());
        m_h = (hourformat === 12 ? (m_h > 12 ? m_h - 12 : m_h) : m_h);
        m_m = parseInt(d.getMinutes());
        m_s = parseInt(d.getSeconds());

        // Format based on display configuration
        if (format === "mm:ss") {
            num = (m_m < 10 ? "0" : "") + m_m + ":" + (m_s < 10 ? "0" : "") + m_s;
        } else if (format === "hh:mm") {
            if (flash_dot) {
                num = (m_h < 10 ? "0" : "") + m_h + ":" + (m_m < 10 ? "0" : "") + m_m;
            } else {
                num = (m_h < 10 ? "0" : "") + m_h + " " + (m_m < 10 ? "0" : "") + m_m;
            }
            flash_dot = !flash_dot;
        } else if (format === "hh") {
            num = (m_h < 10 ? "0" : "") + m_h;
        } else if (format === "mm") {
            num = (m_m < 10 ? "0" : "") + m_m;
        } else if (format === "ss") {
            num = (m_s < 10 ? "0" : "") + m_s;
        } else if (format === "hh:mm:ss") {
            if (flash_dot) {
                num = (m_h < 10 ? "0" : "") + m_h + ":" +
                      (m_m < 10 ? "0" : "") + m_m + ":" +
                      (m_s < 10 ? "0" : "") + m_s;
            } else {
                num = (m_h < 10 ? "0" : "") + m_h + " " +
                      (m_m < 10 ? "0" : "") + m_m + " " +
                      (m_s < 10 ? "0" : "") + m_s;
            }
            flash_dot = !flash_dot;
        } else {
            num = (m_h < 10 ? "0" : "") + m_h + ":" +
                  (m_m < 10 ? "0" : "") + m_m + ":" +
                  (m_s < 10 ? "0" : "") + m_s;
        }
        dig_to_led(num);
    }

    // Convert string to LED display representation
    function dig_to_led(num) {
        razd = 0;
        for (let l = 0; l < num.length; l++) {
            const ch = num.charAt(l);
            razd = ch === ":" ? 10 : (ch === " " ? 11 : ch);
            const spec = charSlot(ch);
            const base = slotStarts.length ? slotStarts[l] : l * 6;

            for (i = 0; i < spec.cols; i++) {
                for (let y = 0; y < 7; y++) {
                    const segment = dig[base + i][y];
                    if (!segment) continue;
                    if (font[y].charAt(razd * 6 + spec.skip + i) === "0") {
                        segment.setAttribute('fill', color);
                        segment.setAttribute('opacity', 1);
                    } else {
                        segment.setAttribute('fill', bgcolor);
                        segment.setAttribute('opacity', bgvisible);
                    }
                }
            }
            // Clear trailing columns in this character slot (safety for variable-width slots).
            const slotCols = formatSlotCols(
                num.charAt(l) === ":" || num.charAt(l) === " " ? ":" : "0"
            );
            for (i = spec.cols; i < slotCols; i++) {
                for (let y = 0; y < 7; y++) {
                    const segment = dig[base + i][y];
                    if (!segment) continue;
                    segment.setAttribute('fill', bgcolor);
                    segment.setAttribute('opacity', bgvisible);
                }
            }
        }
    }
};

var Led = ident.Led;
