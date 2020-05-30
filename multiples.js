function multiplesOf(numbers) {
    var multiples = numbers[0];

    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] % multiples === 0) {
            multiples = numbers[i];
        }
    }

    return multiples;
}
multiples(5);