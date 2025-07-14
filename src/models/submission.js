const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',//"User" wronng
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'cpp', 'java'] 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds//send by judge0 when token is submitted then it gives result that has all this data included
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {  // Recommended addition
    type: Number,
    default: 0
  }
}, { 
  timestamps: true
});

/*index
  -helps in fast finding data in logn time from O(n)
  -sbka index mt banae lag jana kyuki ye space v leta hai
  -index usse data ke liye banana hai jiska data user ko frequently chaiye hota ho
*/
submissionSchema.index({userId:1,problemId:1})//ye krne se index create ho gaya dono ke combination se 

const Submission=mongoose.model('submission',submissionSchema);
module.exports=Submission;



/*What Is an Index?
    -An index is like a sorted quick-access lookup table that the database keeps on the side, separately from the actual collection data.
    -Without an index: to find documents, the database scans every document one by one (O(n) time).
    -With an index: it can jump directly to the relevant entries (O(log n) time in B-Tree indexes).
    -Think of it like the index at the end of a book: you don’t read the whole book to find a topic.

  What Happens When You Do This?
    -submissionSchema.index({ userId: 1, problemId: 1 });
    -You are telling MongoDB:
    -“Please maintain a B-Tree sorted by userId first, and then within each userId by problemId.”
    -So for every new document inserted or updated, MongoDB:
    -Inserts the (userId, problemId) pair into this special sorted structure.
    -Keeps the tree balanced.
    -Stores pointers (references) to the real documents.

  How Does It Work When Querying?
    -db.submissions.find({ userId: 42, problemId: 99 });
    -Without index: MongoDB reads every document, checks userId and problemId.
    -With index:
    -It navigates the B-Tree: first finds all entries with userId = 42.
    -Then within those, finds problemId = 99.
    -Finally, jumps straight to the matching documents.
    -This is much faster.

  Why Not Index Everything?
    -Because:Index uses extra space in your storage.


*/