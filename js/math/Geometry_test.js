
test.it("return difference between to 2D points (subtract x and y)", () => 
    {
        let p1 = {x : 1, y : 2};
        let p2 = {x : 0, y : 3};

        let res = {x : -1, y: 1};
        test.check(res, Geometry.pointOffset(p1, p2));
    }, "    static Geometry::pointOffset(p1, p2)");

test.it("return difference between to bounds square", () => 
    {
       let b1= {
           downLeft : {x : 0, y : 0},
           upLeft : {x : 0, y : 3},
           upRight : {x : 14, y : 0},
           downRight : {x : 2, y : 0},
       };

       let b2= {
           downLeft : {x : 10, y : 0},
           upLeft : {x : 5, y : 7},
           upRight : {x : 5, y : 0},
           downRight : {x : 4, y : 0},
       };

       let res= {
           downLeft : {x : 10, y : 0},
           upLeft : {x : 5, y : 4},
           upRight : {x : -9, y : 0},
           downRight : {x : 2, y : 0},
       };
        test.check(res, Geometry.boundsOffset(b1, b2));
    }, "    static Geometry::boundsOffset(bounds1, bounds2)");
