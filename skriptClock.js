(() => {
  const hr = document.querySelector("#hr");
  const mn = document.querySelector("#mn");
  const sc = document.querySelector("#sc");
  const hoursEl = document.querySelector("#hours");
  const minutesEl = document.querySelector("#minutes");
  const secondsEl = document.querySelector("#seconds");

  if (!hr || !mn || !sc || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

  const tick = () => {
    const day = new Date();
    const hh = day.getHours() * 30;
    const mm = day.getMinutes() * 6;
    const ss = day.getSeconds() * 6;

    hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;

    let h = day.getHours();
    const m = day.getMinutes();
    const s = day.getSeconds();

    if (h > 12) {
      h -= 12;
    }

    hoursEl.textContent = h < 10 ? `0${h}` : String(h);
    minutesEl.textContent = m < 10 ? `0${m}` : String(m);
    secondsEl.textContent = s < 10 ? `0${s}` : String(s);
  };

  tick();
  setInterval(tick, 1000);
})();
