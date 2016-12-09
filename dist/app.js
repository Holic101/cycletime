"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stopwatch = function () {
    function Stopwatch(display, results) {
        _classCallCheck(this, Stopwatch);

        this.running = false;
        this.display = display;
        this.results = results;
        this.average = 0;
        this.laps = [];
        this.cycleTimes = [];
        this.reset();
        this.print(this.times);
        this.average = "";
        this.totalTime = "";
        this.finalVal = '';
    }

    _createClass(Stopwatch, [{
        key: "reset",
        value: function reset() {
            this.times = [0, 0, 0];
        }
    }, {
        key: "start",
        value: function start() {
            if (!this.time) this.time = performance.now();
            if (!this.running) {
                this.running = true;
                requestAnimationFrame(this.step.bind(this));
            }
        }
    }, {
        key: "lap",
        value: function lap() {
            var times = this.times;
            if (this.running) {
                this.reset();
            }
            //visualise cycle times
            var li = document.createElement('li');
            li.innerText = this.format(times);
            this.results.appendChild(li);
            //push every new lap into the cycle time array
            this.cycleTimes.push(times[0] * 60 + times[1] + times[2] / 100);

            /*
            this.minCycleTime = Math.min(...this.cycleTimes).toFixed(2);
            this.maxCycleTime = Math.max(...this.cycleTimes).toFixed(2);
              */
            this.totalTime = this.cycleTimes.reduce(function (a, b) {
                return a + b;
            }, 0);
            var cycles = document.getElementsByTagName("li").length;
            this.average = (this.totalTime / cycles).toFixed(2);

            //visualise the average
            var averageDisplay = document.querySelector(".average");
            var totalTimeDisplay = document.querySelector(".total");
            /*
             let maxCycleTimeDisplay = document.querySelector(".max"); */

            averageDisplay.innerText = "Avg. Cycle Time: " + this.average + " after " + cycles + " cycles";
            totalTimeDisplay.innerText = "Total Time: " + this.totalTime;
            /*
             maxCycleTimeDisplay.innerText = "Max. Cycle Time: " + this.maxCycleTime; */
        }
    }, {
        key: "stop",
        value: function stop() {
            this.running = false;
            this.time = null;
        }
    }, {
        key: "restart",
        value: function restart() {
            if (!this.time) this.time = performance.now();
            if (!this.running) {
                this.running = true;
                requestAnimationFrame(this.step.bind(this));
            }
            this.reset();
        }
    }, {
        key: "clear",
        value: function clear() {
            clearChildren(this.results);
            this.reset();
            this.cycleTimes = [];
            var averageDisplay = document.querySelector(".average");
            averageDisplay.innerText = "";
        }
    }, {
        key: "step",
        value: function step(timestamp) {
            if (!this.running) return;
            this.calculate(timestamp);
            this.time = timestamp;
            this.print();
            requestAnimationFrame(this.step.bind(this));
        }
    }, {
        key: "calculate",
        value: function calculate(timestamp) {
            var diff = timestamp - this.time;
            // Hundredths of a second are 100 ms
            this.times[2] += diff / 10;
            // Seconds are 100 hundredths of a second
            if (this.times[2] >= 100) {
                this.times[1] += 1;
                this.times[2] -= 100;
            }
            // Minutes are 60 seconds
            if (this.times[1] >= 60) {
                this.times[0] += 1;
                this.times[1] -= 60;
            }
        }
    }, {
        key: "print",
        value: function print() {
            this.display.innerText = this.format(this.times);
        }
    }, {
        key: "format",
        value: function format(times) {
            return pad0(times[0], 2) + ":" + pad0(times[1], 2) + ":" + pad0(Math.floor(times[2]), 2);
        }
    }, {
        key: "buildFile",
        value: function buildFile(avg, times) {
            var file = avg + "\n";
            for (var i = 0; i < times.length; i++) {
                file += times[i].toFixed(2) + "\n";
            }
            file += '\n';

            return file;
        }
    }, {
        key: "sendMail",
        value: function sendMail() {
            var emailAddress = prompt("Please enter your email address.");
            var emailSubject = prompt("Please enter the subject of your email.");

            if (emailAddress != undefined) {
                document.location.href = "mailto:" + emailAddress + "?subject=" + emailSubject + "&body=" + encodeURIComponent(this.buildFile(this.totalTime, this.average, this.cycleTimes));
            }
        }
    }]);

    return Stopwatch;
}();

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count) {
        result = '0' + result;
    }return result;
}

function clearChildren(node) {
    while (node.lastChild) {
        node.removeChild(node.lastChild);
    }
}

var stopwatch = new Stopwatch(document.querySelector('.stopwatch'), document.querySelector('.results'));