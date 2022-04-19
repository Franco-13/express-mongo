document.addEventListener("click", e => {
  const short = e.target.dataset.short
  if (short) {
    const url = `${window.location.origin}/${short}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Text copied to clipboard")
      })
      .catch(err => {
        console.log("Something went wrong", err);
      })
  }
})