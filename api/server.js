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
      checkouts: []
    };
  }
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  initData();

  if (req.method === 'GET') {
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const body = req.body || {};
    if (body.books) data.books = body.books;
    if (body.members) data.members = body.members;
    if (body.checkouts) data.checkouts = body.checkouts;
    res.status(200).json({ ok: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
