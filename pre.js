function optipng(file, callback, options, printFunction) {
    if (typeof file === 'undefined')
        return;

    var stdout = "";
    var stderr = "";

    // Default arguments. set output file
    var args = ['-out', '/output.png'];


    // You also can use array of options.
    if (Array.isArray(options)) {
        args = args.concat(options);
    } else {
        // Create command line options to passed using input `options` object
        for (var key in options) {
            if (typeof options[key] == "string") {
                args.push("-" + key);
                if (typeof options[key] !== "boolean") {
                    // option has a value
                    args.push(String(options[key]));
                }
            }
        }
    }

    // Target file name.
    args.push("/input.png");

    var Module = {
        "print": function(text) {
            stdout += text + "\n";
            if (typeof printFunction == "function") printFunction(text);
        },
        "printErr": function(text) {
            stderr += text + "\n";
            if (typeof printFunction == "function") printFunction(text);
        },

        // Mounting input file
        "preRun": [function() {
            FS.writeFile("/input.png", file, {
                encoding: "binary"
            });
        }],
		postRun() {
			let output_file = null;

			// Try to get output file.
			try {
				// read processed image data in file
				output_file = FS.readFile("/output.png");
			} catch (e) {
				// Cleaning up input png from MEMFS
				FS.unlink("/input.png");
				return new Error("No output file: " + stderr);
			}

			// Cleanup files from
			FS.unlink("/output.png");
			FS.unlink("/input.png");

			callback({
				data: output_file,
				stdout: stdout,
				stderr: stderr,
			});
		},
        "arguments": args,
    };