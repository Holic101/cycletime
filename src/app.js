class Stopwatch {
    constructor(display, results) {
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
    
    reset() {
        this.times = [ 0, 0, 0];
    }
    
    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    
    lap() {
        let times = this.times;
        if (this.running) {
            this.reset();
        }
      //visualise cycle times
        let li = document.createElement('li');
        li.innerText = this.format(times);
         this.results.appendChild(li);
      //push every new lap into the cycle time array
        this.cycleTimes.push(times[0]*60+times[1]+times[2]/100);
        
      /*
      this.minCycleTime = Math.min(...this.cycleTimes).toFixed(2);
      this.maxCycleTime = Math.max(...this.cycleTimes).toFixed(2);
        */
      this.totalTime = this.cycleTimes.reduce(function(a,b) {
          return a + b;
        }, 0);
      let cycles = document.getElementsByTagName("li").length;
        this.average = (this.totalTime/cycles).toFixed(2);
     
      //visualise the average
      let averageDisplay = document.querySelector(".average");
      let totalTimeDisplay = document.querySelector(".total");
     /*
      let maxCycleTimeDisplay = document.querySelector(".max"); */
      
      averageDisplay.innerText = "Avg. Cycle Time: " + this.average + " after " + cycles + " cycles";
     totalTimeDisplay.innerText = "Total Time: " + this.totalTime;
     /*
      maxCycleTimeDisplay.innerText = "Max. Cycle Time: " + this.maxCycleTime; */
    }
    
    stop() {
        this.running = false;
        this.time = null;
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }
    
    clear() {
        clearChildren(this.results);
        this.reset();
        this.cycleTimes = [];
         let averageDisplay = document.querySelector(".average");
      averageDisplay.innerText = "";
    }
    
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    
    calculate(timestamp) {
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
    
    print() {
        this.display.innerText = this.format(this.times);
    }
    
    format(times) {
        return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}:\
${pad0(Math.floor(times[2]), 2)}`;
    }
  
  buildFile(avg, times) {
    var file = avg + "\n";
    for (var i = 0; i < times.length; i++) {
    file += times[i].toFixed(2) + "\n";
   }
    file += '\n';
    
    return file;
  }
  
  sendMail()
  {
    var emailAddress = prompt("Please enter your email address.");
    var emailSubject = prompt("Please enter the subject of your email.");
   
   if (emailAddress != undefined) {
    document.location.href = "mailto:" + emailAddress + "?subject=" + emailSubject + "&body=" + encodeURIComponent(this.buildFile(this.totalTime, this.average,this.cycleTimes));
     }
    }

}
function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'),
    document.querySelector('.results'));