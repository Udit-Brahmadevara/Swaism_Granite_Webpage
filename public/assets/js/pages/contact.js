/**
 * Contact: enquiry form.
 *
 * `FORM_ENDPOINT` is the one line to change when a handler is chosen
 * (Formspree, Netlify Forms, a custom API). Until then the form validates and
 * opens WhatsApp with the enquiry typed out, for the buyer to send.
 */
import { GRANITES, FINISHES, COMPANY, OFFICE_HOURS, WHATSAPP } from '../data.js';
import { esc, qs, mount } from '../core/dom.js';
import { defRows } from '../components/cards.js';
import '../components/chrome.js';

const FORM_ENDPOINT = null;   // e.g. 'https://formspree.io/f/xxxxxxx'

mount('[data-contact-lines]', defRows([
  ['Managing Director', COMPANY.md],
  ['Phone',   COMPANY.phone],
  ['Email',   COMPANY.email],
  ['Address', COMPANY.address],
]));
mount('[data-hours]', defRows(OFFICE_HOURS.map(h => [h.k, h.v])));

mount('[data-contact-actions]', `
  <a class="btn btn--green" href="tel:${esc(COMPANY.phoneHref)}">Call</a>
  <a class="btn btn--outline" href="${esc(WHATSAPP)}"
     target="_blank" rel="noopener noreferrer">WhatsApp</a>`);

const stoneSel  = qs('[data-stones]');
const finishSel = qs('[data-finishes]');
if (stoneSel)  stoneSel.innerHTML  = GRANITES.map(g => `<option value="${esc(g.id)}">${esc(g.name)}</option>`).join('');
if (finishSel) finishSel.innerHTML = FINISHES.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join('');

/* Deep link from the catalogue (/contact#tan-brown). Handled on load and on
   hashchange, since a hash-only change never reloads the document. */
const applyStoneHash = () => {
  const id = location.hash.replace('#', '');
  if (stoneSel && id && GRANITES.some(g => g.id === id)) stoneSel.value = id;
};
applyStoneHash();
addEventListener('hashchange', applyStoneHash);

/* The location panel is static markup — see the note in tools/pages.py. The
   live Google embed it replaced set third-party cookies on load, which is the
   single thing that would have obliged this site to carry a consent banner. */

const form = qs('[data-enquiry]');
const note = qs('[data-form-note]');

const showNote = (msg, isError = false) => {
  if (!note) return;
  note.textContent = msg;
  note.hidden = false;
  note.classList.toggle('form__note--error', isError);
};

/* Spam defence, in two cheap layers and no third party.

   1. The honeypot: a field hidden from people and from assistive technology.
      Scripted submitters fill every input they find, so anything arriving with
      it set did not come from a person.
   2. The time trap: a bot posts the moment the DOM is ready. A buyer choosing a
      stone, a finish and typing a requirement cannot do it in under three
      seconds.

   Both fail silently and report success. Telling a spammer precisely why it was
   rejected is how it learns to get past the check. */
const MIN_FILL_MS = 3000;
const rendered = Date.now();
const SENT = 'Inquiry received. Our export desk will respond within one working day.';

form?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const data  = Object.fromEntries(new FormData(form).entries());
  const stone = GRANITES.find(g => g.id === data.stone);

  if (data.fax || Date.now() - rendered < MIN_FILL_MS) {
    showNote(SENT);
    form.reset();
    return;
  }
  delete data.fax;

  if (FORM_ENDPOINT) {
    try {
      const payload = new FormData(form);
      payload.delete('fax');            // never forward the trap field
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST', headers: { Accept: 'application/json' }, body: payload,
      });
      if (!res.ok) throw new Error(res.statusText);
      showNote(SENT);
      form.reset();
    } catch {
      showNote(`Could not send just now. Please email ${COMPANY.email} directly.`, true);
    }
    return;
  }

  // No endpoint configured: compose the enquiry as a WhatsApp message instead.
  // Optional fields left blank are dropped rather than sent as empty labels.
  const fields = [
    ['Name', data.name],
    ['Company', data.company],
    ['Email', data.email],
    ['Destination port', data.port],
    ['Stone of interest', stone?.name],
    ['Finish', data.finish],
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  const text = [
    `*B2B enquiry: ${stone ? stone.name : 'Swasim Granite'}*`, '',
    ...fields, '', 'Requirement:', data.requirement || '',
  ].join('\n');
  const url = `${WHATSAPP}?text=${encodeURIComponent(text)}`;

  // A new tab keeps the filled form here if the buyer comes back. Still inside
  // the click, so pop-up blockers allow it; if one refuses, use this tab.
  const win = open(url, '_blank');
  if (win) win.opener = null;
  else location.href = url;
  showNote(`Opening WhatsApp with your inquiry. Press send there to reach us. `
    + `No WhatsApp? Email ${COMPANY.email}.`);
});
