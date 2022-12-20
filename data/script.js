const app = new Vue({
    el: '#app',
    data: {
        rows: 10,
        cols: 10,

        currentColor: 'rgb(0, 0, 0)',
        lastColor: null,
        lastColors: [],

        name: null,
        gridColor: [
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
            ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
        ],
        seconds: 0,

        saved: []
    },
    methods: {
        changeColorCell(row, col) {
            Vue.set(this.gridColor[row-1], col-1, this.currentColor);
        },
        copyColorCell(row, col) {
            this.currentColor = this.getColor(row, col)
        },
        getColor(row, col) {
            return this.gridColor[row-1][col-1]
        },
        componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },
        resetUI() {
            this.currentColor = 'rgb(0, 0, 0)';
            this.seconds = 0;
            this.name = null;
            this.lastColor = null;
            this.lastColors = [];

            for(let r = 0; r < this.rows; r++) {
                for(let c = 0; c < this.cols; c++) {
                    Vue.set(this.gridColor[r], c, this.currentColor);
                }
            }
        },
        openModalSave() {
            app.$refs.backdrop.classList.toggle("d-block");
            app.$refs.modal.classList.toggle("d-block");

            setTimeout(() => {
                app.$refs.backdrop.classList.toggle("show");
                app.$refs.modal.classList.toggle("show");
            }, 100);
        },
        closeModalSave() {
            app.$refs.backdrop.classList.toggle("show");
            app.$refs.modal.classList.toggle("show");

            setTimeout(() => {
                app.$refs.backdrop.classList.toggle("d-block");
                app.$refs.modal.classList.toggle("d-block");
            }, 100);
        },
        convertDataToCode(arrayGrid, time) {
            let code = '';

            code += 'fita.clear(); ';

            for(row in arrayGrid) {
                for(col in arrayGrid[row]) {
                    let r, g, b, c = this.currentColor.substring(this.currentColor.indexOf('(')+1, this.currentColor.length-1).split(',');

                    r = +c[0].trim()
                    g = +c[1].trim()
                    b = +c[2].trim()

                    if(r+g+b > 0) {
                        code += `fita.setPixelColor(${(row*10)+parseInt(col)}, ${r}, ${g}, ${b}); `;
                    }
                }
            }

            code += `delay(${parseInt(time)*1000});`;

            return code;
        },
        serialize(arrayGrid) {
            let obj = [];

            for(row in arrayGrid) {
                for(col in arrayGrid[row]) {
                    let r, g, b, c = this.getColor(parseInt(row)+1, parseInt(col)+1).substring(this.getColor(parseInt(row)+1, parseInt(col)+1).indexOf('(')+1, this.getColor(parseInt(row)+1, parseInt(col)+1).length-1).split(',');

                    r = +c[0].trim()
                    g = +c[1].trim()
                    b = +c[2].trim()

                    if(r+g+b > 0) {
                        obj.push([(row*10)+parseInt(col), r, g, b]);
                    }
                }
            }

            return obj;
        },
        save() {
            let obj = {
                name: this.name,
                time: this.seconds,
                grid: this.gridColor,
                timestamp: new Date(),
                // code: this.convertDataToCode(this.gridColor, this.seconds)
                code: this.serialize(this.gridColor)
            };

            this.saved.push(obj);

            axios
                .post('/save', obj, { headers: { 'content-type': 'application/json' }, })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                })

            // localStorage.setItem('savedArts', JSON.stringify(this.saved));

            this.resetUI();
            this.getSavedArts();
            this.closeModalSave();
        },
        getSavedArts() {
            // let storage = localStorage.getItem('savedArts');
            // this.saved = storage != undefined ? JSON.parse(storage) : [];
        }
    },
    computed: {
        currentColorHex: {
            get() {
                let r, g, b, c = this.currentColor.substring(this.currentColor.indexOf('(')+1, this.currentColor.length-1).split(',');

                r = +c[0].trim()
                g = +c[1].trim()
                b = +c[2].trim()

                return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
            },
            set(newColor) {
                if(this.lastColor == null) {
                    this.lastColor = this.currentColor;
                }

                let r = parseInt(newColor.slice(1, 3), 16),
                g = parseInt(newColor.slice(3, 5), 16),
                b = parseInt(newColor.slice(5, 7), 16);

                this.currentColor = `rgb(${r}, ${g}, ${b})`;
            }
        }
    },
    mounted: function() {
        this.getSavedArts()
    },
});