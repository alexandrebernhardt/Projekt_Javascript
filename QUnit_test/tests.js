function id_test(p) {
    
    var ident = "1234";
    
    if (p === undefined) {
        console.log("you have to give a parameter !");
    } else {
        if (typeof temp !== "string") {
            console.log("the argument must be a string");
        }
    }
    if (p === ident) {
        return true;
    } else {
        return false;
    }
}

function temp_test(temp) {
    if (temp === undefined) {
        console.log("you have to give a parameter !");
    } else {
        if (typeof temp !== "number") {
            console.log("the argument must be a number");
        }
    }
    
    if (temp < 60 && temp > 2) {
        return true;
    } else {
        return false;
    }
}
QUnit.test("Standard usage", function (assert) {
    assert.strictEqual(id_test("1234"), true);  
    assert.strictEqual(id_test("123"), false);
    assert.strictEqual(temp_test(20), true);
    assert.strictEqual(temp_test(65), false);
});


QUnit.test("Type of", function (assert) {
    assert.throws(id_test(1234), "Givinng anythig else than a string raises an error.");
    assert.throws(temp_test([]), "Givinng anything else than a number raises an error.");
});

QUnit.test("Existence of", function (assert) {
    assert.throws(id_test(), "Not giving a parameter will raises an error.");
    assert.throws(temp_test(), "Not giving a parameter will raises an error.");
});