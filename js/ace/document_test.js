/*
 *  _       _                     _   
 * | |     | |                   | |  
 * | | __ _| |__   ___ ___   __ _| |_               Labcoat (R)
 * | |/ _` | '_ \ / __/ _ \ / _` | __|              Powerful development environment for Quirrel.
 * | | (_| | |_) | (_| (_) | (_| | |_               Copyright (C) 2010 - 2013 SlamData, Inc.
 * |_|\__,_|_.__/ \___\___/ \__,_|\__|              All Rights Reserved.
 *
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the 
 * GNU Affero General Public License as published by the Free Software Foundation, either version 
 * 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See 
 * the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this 
 * program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var Document = require("./document").Document;
var Range = require("./range").Range;
var assert = require("./test/assertions");

module.exports = {

    "test: insert text in line" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insert({row: 0, column: 1}, "juhu");
        assert.equal(doc.getValue(), ["1juhu2", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["1juhu2", "34"].join("\n"));
    },

    "test: insert new line" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insertNewLine({row: 0, column: 1});
        assert.equal(doc.getValue(), ["1", "2", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["1", "2", "34"].join("\n"));
    },

    "test: insert lines at the beginning" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insertLines(0, ["aa", "bb"]);
        assert.equal(doc.getValue(), ["aa", "bb", "12", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["aa", "bb", "12", "34"].join("\n"));
    },

    "test: insert lines at the end" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insertLines(2, ["aa", "bb"]);
        assert.equal(doc.getValue(), ["12", "34", "aa", "bb"].join("\n"));
    },

    "test: insert lines in the middle" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insertLines(1, ["aa", "bb"]);
        assert.equal(doc.getValue(), ["12", "aa", "bb", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12", "aa", "bb", "34"].join("\n"));
    },

    "test: insert multi line string at the start" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insert({row: 0, column: 0}, "aa\nbb\ncc");
        assert.equal(doc.getValue(), ["aa", "bb", "cc12", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["aa", "bb", "cc12", "34"].join("\n"));
    },

    "test: insert multi line string at the end" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insert({row: 2, column: 0}, "aa\nbb\ncc");
        assert.equal(doc.getValue(), ["12", "34aa", "bb", "cc"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12", "34aa", "bb", "cc"].join("\n"));
    },

    "test: insert multi line string in the middle" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.insert({row: 0, column: 1}, "aa\nbb\ncc");
        assert.equal(doc.getValue(), ["1aa", "bb", "cc2", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["1aa", "bb", "cc2", "34"].join("\n"));
    },

    "test: delete in line" : function() {
        var doc = new Document(["1234", "5678"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.remove(new Range(0, 1, 0, 3));
        assert.equal(doc.getValue(), ["14", "5678"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["1234", "5678"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["14", "5678"].join("\n"));
    },

    "test: delete new line" : function() {
        var doc = new Document(["1234", "5678"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.remove(new Range(0, 4, 1, 0));
        assert.equal(doc.getValue(), ["12345678"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["1234", "5678"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12345678"].join("\n"));
    },

    "test: delete multi line range line" : function() {
        var doc = new Document(["1234", "5678", "abcd"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.remove(new Range(0, 2, 2, 2));
        assert.equal(doc.getValue(), ["12cd"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["1234", "5678", "abcd"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12cd"].join("\n"));
    },

    "test: delete full lines" : function() {
        var doc = new Document(["1234", "5678", "abcd"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e.data); });

        doc.remove(new Range(1, 0, 3, 0));
        assert.equal(doc.getValue(), ["1234", ""].join("\n"));
    },

    "test: remove lines should return the removed lines" : function() {
        var doc = new Document(["1234", "5678", "abcd"]);

        var removed = doc.removeLines(1, 2);
        assert.equal(removed.join("\n"), ["5678", "abcd"].join("\n"));
    },

    "test: should handle unix style new lines" : function() {
        var doc = new Document(["1", "2", "3"]);
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));
    },

    "test: should handle windows style new lines" : function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("unix");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));
    },

    "test: set new line mode to 'windows' should use '\\r\\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));
        doc.setNewLineMode("windows");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\r\n"));
    },

    "test: set new line mode to 'unix' should use '\\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("unix");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));
    },

    "test: set new line mode to 'auto' should detect the incoming nl type": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));

        doc.setNewLineMode("auto");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));

        var doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("auto");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\r\n"));

        doc.replace(new Range(0, 0, 2, 1), ["4", "5", "6"].join("\n"));
        assert.equal(["4", "5", "6"].join("\n"), doc.getValue());
    },

    "test: set value": function() {
        var doc = new Document("1");
        assert.equal("1", doc.getValue());

        doc.setValue(doc.getValue());
        assert.equal("1", doc.getValue());

        var doc = new Document("1\n2");
        assert.equal("1\n2", doc.getValue());

        doc.setValue(doc.getValue());
        assert.equal("1\n2", doc.getValue());
    },

    "test: empty document has to contain one line": function() {
        var doc = new Document("");
        assert.equal(doc.$lines.length, 1);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}