// Mobile nav
const burger = document.querySelector('.burger');
const links = document.querySelector('.links');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Project filters
const chips = document.querySelectorAll('.chip[data-filter]');
const cards = document.querySelectorAll('[data-cat]');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('on'));
    chip.classList.add('on');
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      card.style.display = (f === 'all' || card.dataset.cat.split(' ').includes(f)) ? '' : 'none';
    });
  });
});
