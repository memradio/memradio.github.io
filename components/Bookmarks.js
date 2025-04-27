export function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarkedMemes') || '[]');
  }
  
  export function isBookmarked(memeNumber) {
    return getBookmarks().includes(memeNumber);
  }
  
  export function toggleBookmark(memeNumber) {
    let bookmarks = getBookmarks();
    if (bookmarks.includes(memeNumber)) {
      bookmarks = bookmarks.filter(num => num !== memeNumber);
    } else {
      bookmarks.push(memeNumber);
    }
    localStorage.setItem('bookmarkedMemes', JSON.stringify(bookmarks));
  }
  