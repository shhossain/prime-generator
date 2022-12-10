// classs
      // default dict
      class DefaultDict {
        constructor(defaultVal) {
          return new Proxy(
            {},
            {
              get: (target, name) =>
                name in target ? target[name] : defaultVal,
            }
          );
        }
      }

      // consts
      const start = document.getElementById("start");
      const end = document.getElementById("end");
      const submit = document.getElementById("submit");
      const result = document.getElementById("result");
      const range = document.getElementById("range");
      const total = document.getElementById("total");
      const copy = document.getElementById("copy");
      const data = document.querySelectorAll(".data");
      const sep = document.getElementById("sep");

      const MAX_MEM = 1000000;

      // global vars
      let start_value = 1;
      let end_value = 100;
      let active = "plain";
      let separator = ", ";
      let totalMem = 0;

      let mem = new DefaultDict(0);

      function set_param(key, value) {
        // add param to url
        let url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState({}, "", url);
      }

      function get_param(key) {
        // get param from url
        let url = new URL(window.location.href);
        return url.searchParams.get(key);
      }

      function remove_param(key) {
        // remove param from url
        let url = new URL(window.location.href);
        url.searchParams.delete(key);
        window.history.pushState({}, "", url);
      }

      function prime_seive(n) {
        let prime = new Array(n + 1).fill(true);
        prime[0] = false;
        prime[1] = false;
        for (let i = 2; i * i <= n; i++) {
          if (prime[i]) {
            for (let j = i * i; j <= n; j += i) {
              prime[j] = false;
            }
          }
        }
        return prime;
      }

      function prime_list(n) {
        let prime = prime_seive(n);
        let list = [];
        for (let i = 0; i <= n; i++) {
          if (prime[i]) {
            list.push(i);
          }
        }
        return list;
      }

      // show result
      function show_result() {
        let list = [];
        if (mem[end_value] != 0) {
          list = mem[end_value];
        } else {
          list = prime_list(end_value);
          mem[end_value] = list;
          totalMem += list.length;

          if (totalMem > MAX_MEM) {
            mem = new DefaultDict(0);
            totalMem = 0;
          }
        }

        let count = list.length;
        let text = "";
        let ct = 0;

        let nw_list = [];
        let i = 0;
        while (i < count) {
          if (list[i] >= start_value) {
            nw_list.push(list[i]);
            ct++;
          }
          i++;
        }
        text = nw_list.join(separator);

        if (active == "array") {
          text = "[" + text + "]";
        } else if (active == "json") {
          let txt = '{\n\t"primes": [';
          text = txt + text + "]\n}";
        } else if (active == "line") {
          text = text.replace(/,/g, "\n");
        }

        result.innerText = text;
        range.innerText = start_value + " to " + end_value;
        total.innerText = ct;
        // change title
        document.title = "Primes " + start_value + " to " + end_value;
      }

      // event listeners
      submit.addEventListener("click", function () {
        start_value = parseInt(start.value);
        end_value = parseInt(end.value);
        separator = sep.value;

        // set params start,end,sep,and active
        set_param("start", start_value);
        set_param("end", end_value);
        set_param("sep", separator);
        set_param("active", active);

        show_result();
      });

      copy.addEventListener("click", function () {
        let text = result.innerText;
        let input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
        copy.innerText = "Copied";
        setTimeout(function () {
          copy.innerText = "Copy";
        }, 500);
      });

      for (let i = 0; i < data.length; i++) {
        data[i].addEventListener("click", function () {
          active = data[i].innerText.toLowerCase();
          set_param("active", active);
          for (let j = 0; j < data.length; j++) {
            if (j == i) {
              data[j].classList.remove("btn-outline-secondary");
              data[j].classList.add("btn-primary");
            } else {
              data[j].classList.remove("btn-primary");
              data[j].classList.add("btn-outline-secondary");
            }
          }
          show_result();
        });
      }

      // on document load parse params
      document.addEventListener("DOMContentLoaded", function () {
        let start_param = get_param("start");
        let end_param = get_param("end");
        let sep_param = get_param("sep");
        let active_param = get_param("active");

        if (start_param != null) {
          start_value = parseInt(start_param);
          start.value = start_value;
        }
        if (end_param != null) {
          end_value = parseInt(end_param);
          end.value = end_value;
        }
        if (sep_param != null) {
          separator = sep_param;
          sep.value = separator;
        }
        if (active_param != null) {
          active = active_param;
          for (let j = 0; j < data.length; j++) {
            if (data[j].innerText.toLowerCase() == active) {
              data[j].classList.remove("btn-outline-secondary");
              data[j].classList.add("btn-primary");
            } else {
              data[j].classList.remove("btn-primary");
              data[j].classList.add("btn-outline-secondary");
            }
          }
        }
        show_result();
      });