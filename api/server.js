/**
 * Library Management System API — Vercel Serverless Function
 * In-memory storage (resets on cold start).
 * Frontend falls back to localStorage if API is unavailable.
 */

let data = null;

function initData() {
  if (!data) {
    data = {
      books: [
        { id:'BK001', title:'The Great Gatsby', author:'F. Scott Fitzgerald', genre:'Fiction', isbn:'978-0-7432-7356-5', available:true },
        { id:'BK002', title:'To Kill a Mockingbird', author:'Harper Lee', genre:'Fiction', isbn:'978-0-06-112008-4', available:true },
        { id:'BK003', title:'1984', author:'George Orwell', genre:'Fiction', isbn:'978-0-452-28423-4', available:true },
        { id:'BK004', title:'A Brief History of Time', author:'Stephen Hawking', genre:'Science', isbn:'978-0-553-38016-3', available:true },
        { id:'BK005', title:'Sapiens', author:'Yuval Noah Harari', genre:'History', isbn:'978-0-06-231609-7', available:true },
        { id:'BK006', title:'Clean Code', author:'Robert C. Martin', genre:'Technology', isbn:'978-0-13-235088-4', available:true },
        { id:'BK007', title:'Steve Jobs', author:'Walter Isaacson', genre:'Biography', isbn:'978-1-4516-4853-9', available:true },
        { id:'BK008', title:'The Selfish Gene', author:'Richard Dawkins', genre:'Science', isbn:'978-0-19-878860-7', available:true },
        { id:'BK009', title:'Thinking, Fast and Slow', author:'Daniel Kahneman', genre:'Non-Fiction', isbn:'978-0-374-53355-7', available:true },
        { id:'BK010', title:'The Pragmatic Programmer', author:'Andrew Hunt', genre:'Technology', isbn:'978-0-13-595705-9', available:true },
      ],
      members: [
        { id:'MEM001', name:'Ahmed Khan', joined:'2026-01-15' },
        { id:'MEM002', name:'Sara Ali', joined:'2026-02-20' },
        { id:'MEM003', name:'Bilal Ahmed', joined:'2026-03-10' },
      ],
      checkouts: [
        { id:'CO001', bookId:'BK001', memberId:'MEM001', dueDate:'2026-09-01', returned:false },
      ]
    };
  }
}

function send(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(body);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  initData();
  const segments = (req.url || '/').split('?')[0].split('/').filter(Boolean);

  // State snapshot for the frontend
  if (req.method === 'GET' && segments.length === 0) {
    return send(res, 200, data);
  }

  // Bulk replace from the frontend (offline-first sync)
  if (req.method === 'POST' && segments.length === 0) {
    const body = req.body || {};
    if (body.books) data.books = body.books;
    if (body.members) data.members = body.members;
    if (body.checkouts) data.checkouts = body.checkouts;
    return send(res, 200, { ok: true });
  }

  // Book / member search: GET /books/search?q=term
  if (req.method === 'GET' && segments[0] === 'books' && segments[1] === 'search') {
    const q = (req.query?.q || '').toString().toLowerCase();
    const results = q ? data.books.filter((b) =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q)
    ) : data.books;
    return send(res, 200, { ok: true, count: results.length, data: results });
  }

  // Checkout: POST /checkout  { bookId, memberId, dueDate }
  if (req.method === 'POST' && segments[0] === 'checkout') {
    const { bookId, memberId, dueDate } = req.body || {};
    const book = data.books.find((b) => b.id === bookId);
    const member = data.members.find((m) => m.id === memberId);
    if (!book || !member) {
      return send(res, 400, { ok: false, error: 'Invalid book or member id' });
    }
    if (!book.available) {
      return send(res, 409, { ok: false, error: 'Book is already checked out' });
    }
    const checkout = {
      id: 'CO' + String(data.checkouts.length + 1).padStart(3, '0'),
      bookId,
      memberId,
      dueDate: dueDate || '2026-09-01',
      returned: false,
    };
    data.checkouts.push(checkout);
    book.available = false;
    return send(res, 201, { ok: true, checkout });
  }

  // Return: POST /return/:checkoutId
  if (req.method === 'POST' && segments[0] === 'return') {
    const checkout = data.checkouts.find((c) => c.id === segments[1]);
    if (!checkout) {
      return send(res, 404, { ok: false, error: 'Checkout not found' });
    }
    checkout.returned = true;
    const book = data.books.find((b) => b.id === checkout.bookId);
    if (book) book.available = true;
    return send(res, 200, { ok: true, checkout });
  }

  return send(res, 405, { error: 'Method not allowed' });
};
