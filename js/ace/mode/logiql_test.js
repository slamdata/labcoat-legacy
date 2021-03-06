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
}

define(function(require, exports, module) {
"use strict";

var EditSession = require("../edit_session").EditSession;
var Tokenizer = require("../tokenizer").Tokenizer;
var LogiQLMode = require("./logiql").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {    
        this.mode = new LogiQLMode();
    },

    "test: toggle comment lines should prepend '//' to each line" : function() {
        var session = new EditSession(["  abc", "cde", "fg"]);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["//   abc", "// cde", "fg"].join("\n"), session.toString());
    },

    "test: auto indent after ->" : function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "parent(a, b) ->", "  "));
    },
    
    "test: auto indent after <--" : function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "foo <--    ", "  "));
    },

    "test: no auto indent in multi line comment" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "/* -->", "  "));
        assert.equal("  ", this.mode.getNextLineIndent("start", "  /* ->", "    "));
        assert.equal("  ", this.mode.getNextLineIndent("comment.block0", "  abcd", "  "));
    },

    "test: no auto indent after -> in single line comment" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "//->", "  "));
        assert.equal("  ", this.mode.getNextLineIndent("start", "  //->", "  "));
    },

    "test: trigger outdent if line ends with ." : function() {
        assert.ok(this.mode.checkOutdent("start", "   ", "\n"));
        assert.ok(this.mode.checkOutdent("start", " a  ", "\r\n"));
        assert.ok(!this.mode.checkOutdent("start", "", "}"));
        assert.ok(!this.mode.checkOutdent("start", "   ", "a }"));
        assert.ok(!this.mode.checkOutdent("start", "   }", "}"));
    },

    "test: auto outdent should indent the line with the same indent as the line with the matching ->" : function() {
        var session = new EditSession(["  bar (a, b) ->", "  foo(a)[1.2]", "    bla.", "    "], new LogiQLMode());
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  ", session.getLine(3));
    },

    "test: no auto outdent if no matching brace is found" : function() {
        var session = new EditSession(["  bar (a, b) ->", "  foo(a)[1.2].", "    bla.", "    "], new LogiQLMode());
        this.mode.autoOutdent("start", session, 2);
        assert.equal("    ", session.getLine(3));
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
