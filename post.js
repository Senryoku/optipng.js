
};


// for npm... maybe working? idk
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = optipng;
} else {
    optipng.call(this);
}