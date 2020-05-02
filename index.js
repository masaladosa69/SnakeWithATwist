const app = require("./server/app.js");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
