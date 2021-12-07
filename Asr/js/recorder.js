/*License (MIT)

Copyright Â© 2013 Matt Diamond

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of 
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

(function (window) {

    var WORKER_PATH = '/Asr/js/recorderWorker.js';
  
    var Recorder = function (source, cfg) {
      var config = cfg || {};
      var bufferLen = config.bufferLen || 4096;
      this.context = source.context;
      if (!this.context.createScriptProcessor) {
        this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
      } else {
        this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
      }
  
      var worker = new Worker(config.workerPath || WORKER_PATH);
      worker.postMessage({
        command: 'init',
        config: {
          sampleRate: this.context.sampleRate
        }
      });
      var recording = false,
        currCallback;
  
      this.node.onaudioprocess = function (e) {
        console.log("abhishek_test_005: onaudioprocess", recording);
        if (!recording) return;
        worker.postMessage({
          command: 'record',
          buffer: [
            e.inputBuffer.getChannelData(0),
            e.inputBuffer.getChannelData(1)
          ]
        });
      }
  
      this.configure = function (cfg) {
        for (var prop in cfg) {
          if (cfg.hasOwnProperty(prop)) {
            config[prop] = cfg[prop];
          }
        }
      }
  
      this.record = function () {
        console.log("abhishek_test_009: record call function");
        recording = true;
      }
  
      this.stop = function () {
        console.log("abhishek_test_010: stop call function");
        recording = false;
      }
  
      this.clear = function () {
        console.log("abhishek_test_006: clear function");
        worker.postMessage({ command: 'clear' });
      }
  
      this.getBuffers = function (cb) {
        console.log("abhishek_test_007: getBuffers function");
        currCallback = cb || config.callback;
        worker.postMessage({ command: 'getBuffers' })
      }
  
      this.exportWAV = function (cb, type) {
        console.log("abhishek_test_008: exporWAV function");
        currCallback = cb || config.callback;
        type = type || config.type || 'audio/wav';
        if (!currCallback) throw new Error('Callback not set');
        worker.postMessage({
          command: 'exportWAV',
          type: type
        });
      }
  
      this.exportMonoWAV = function (cb, type) {
        currCallback = cb || config.callback;
        type = type || config.type || 'audio/wav';
        if (!currCallback) throw new Error('Callback not set');
        worker.postMessage({
          command: 'exportMonoWAV',
          type: type
        });
      }
  
      worker.onmessage = function (e) {
        var blob = e.data;
        currCallback(blob);
      }
  
      source.connect(this.node);
      this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    };
  
    Recorder.setupDownload = function (blob, filename) {
      var url = (window.URL || window.webkitURL).createObjectURL(blob);
      var link = document.getElementById("save");
      link.href = url;
      link.download = filename || 'output.wav';
      var url_to_upload_blob = url;
      //alert("url to to upload: "+url_to_upload_blob)
      console.log(url_to_upload_blob);
      var data = new FormData();
      var language = $("#lang").val()
      data.append('file', blob);
      data.append('language', language);
      console.log("before ajaxx");
      console.log(link);
      $.ajax({
        url: "lib/vocal_render.php",
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function (data) {
          //alert("successfully uploaded to server!");
          //alert("The text that is spoken in "+data.language+" is : "+data.recognised_text);
          $(".microphone_and_asr_text").text(data.recognised_text);
        },
        error: function () {
          alert("error in server!");
        }
      });
      console.log("after ajax");
    }
  
    window.Recorder = Recorder;
  
  })(window);