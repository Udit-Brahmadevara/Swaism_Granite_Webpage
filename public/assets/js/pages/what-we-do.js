/** What We Do: the product range and the quarry-to-delivery journey. */
import { PRODUCTS, JOURNEY } from '../data.js';
import { mount } from '../core/dom.js';
import { productCards, journeySteps } from '../components/cards.js';
import '../components/chrome.js';

mount('[data-products]', productCards(PRODUCTS));
mount('[data-journey]',  journeySteps(JOURNEY));
