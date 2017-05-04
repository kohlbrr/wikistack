// var chai = require('chai');
// var expect = chai.expect;
// var spies = require('chai-spies')
// chai.use(spies);

// describe("tests", function() {
//     it("should equal 4", function() {
//         expect(2 + 2).to.equal(4);
//     });
//     it("should take one second", function(done) {
//         setTimeout(function() { done() }, 1000)
//     })
//     it("should spy well", function() {
//         function logger(e) {
//             console.log(e);
//         }
//         logger = chai.spy(logger)
//         var arr = [1, 2, 3, 4, 5, 6];
//         arr.forEach(logger);
//         expect(logger).to.have.been.called.exactly(6);
//     })

// });