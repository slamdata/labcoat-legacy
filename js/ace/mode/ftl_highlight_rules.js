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

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var FtlLangHighlightRules = function () {

    var stringBuiltIns = "\\?|substring|cap_first|uncap_first|capitalize|chop_linebreak|date|time|datetime|"
        + "ends_with|html|groups|index_of|j_string|js_string|json_string|last_index_of|length|lower_case|"
        + "left_pad|right_pad|contains|matches|number|replace|rtf|url|split|starts_with|string|trim|"
        + "upper_case|word_list|xhtml|xml";
    var numberBuiltIns = "c|round|floor|ceiling";
    var dateBuiltIns = "iso_[a-z_]+";
    var seqBuiltIns = "first|last|seq_contains|seq_index_of|seq_last_index_of|reverse|size|sort|sort_by|chunk";
    var hashBuiltIns = "keys|values";
    var xmlBuiltIns = "children|parent|root|ancestors|node_name|node_type|node_namespace";
    var expertBuiltIns = "byte|double|float|int|long|short|number_to_date|number_to_time|number_to_datetime|"
        + "eval|has_content|interpret|is_[a-z_]+|namespacenew";
    var allBuiltIns = stringBuiltIns + numberBuiltIns + dateBuiltIns + seqBuiltIns + hashBuiltIns
        + xmlBuiltIns + expertBuiltIns;

    var deprecatedBuiltIns = "default|exists|if_exists|web_safe";

    var variables = "data_model|error|globals|lang|locale|locals|main|namespace|node|current_node|"
        + "now|output_encoding|template_name|url_escaping_charset|vars|version";

    var operators = "gt|gte|lt|lte|as|in|using";

    var reserved = "true|false";

    var attributes = "encoding|parse|locale|number_format|date_format|time_format|datetime_format|time_zone|"
        + "url_escaping_charset|classic_compatible|strip_whitespace|strip_text|strict_syntax|ns_prefixes|"
        + "attributes";

    this.$rules = {
        "start" : [{
            token : "constant.character.entity",
            regex : /&[^;]+;/
        }, {
            token : "support.function",
            regex : "\\?("+allBuiltIns+")"
        },  {
            token : "support.function.deprecated",
            regex : "\\?("+deprecatedBuiltIns+")"
        }, {
            token : "language.variable",
            regex : "\\.(?:"+variables+")"
        }, {
            token : "constant.language",
            regex : "\\b("+reserved+")\\b"
        }, {
            token : "keyword.operator",
            regex : "\\b(?:"+operators+")\\b"
        }, {
            token : "entity.other.attribute-name",
            regex : attributes
        }, {
            token : "string", //
            regex : /['"]/,
            next : "qstring"
        }, {
            // Deal with variable names that contains number
            // e.g. <#if var42 == 42 >
            token : function(value) {
                if (value.match("^[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?$")) {
                    return "constant.numeric";
                } else {
                    return "variable";
                }
            },
            regex : /[\w.+\-]+/
        }, {
            token : "keyword.operator",
            regex : "!|\\.|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^="
        }, {
            token : "paren.lparen",
            regex : "[[({]"
        }, {
            token : "paren.rparen",
            regex : "[\\])}]"
        }, {
            token : "text",
            regex : "\\s+"
        }],

        "qstring" : [{
            token : "constant.character.escape",
            regex : '\\\\[nrtvef\\\\"$]'
        }, {
            token : "string",
            regex : /['"]/,
            next : "start"
        }, {
            defaultToken : "string"
        }]
    };
};

oop.inherits(FtlLangHighlightRules, TextHighlightRules);

var FtlHighlightRules = function() {
    var directives = "assign|attempt|break|case|compress|default|elseif|else|escape|fallback|function|flush|"
        + "ftl|global|if|import|include|list|local|lt|macro|nested|noescape|noparse|nt|recover|recurse|return|rt|"
        + "setting|stop|switch|t|visit";

    HtmlHighlightRules.call(this);

    for (var i in this.$rules) {
        this.$rules[i].unshift({
            token : "string.interpolated",
            regex : "\\${",
            push  : "ftl-start"
        }, {
            token : "keyword.function",
            regex :  "</?#("+directives+")",
            push : "ftl-start"
        }, {
            token : "keyword.other",
            regex : "</?@[a-zA-Z\\.]+",
            push : "ftl-start"
        });
    }

    this.embedRules(FtlLangHighlightRules, "ftl-");

    this.$rules["ftl-start"].unshift({
       token : "keyword",
        regex : "/?>",
        next  : "pop"
    }, {
        token : "string.interpolated",
        regex : "}",
        next  : "pop"
    });

    this.$rules.start.unshift({
        token : "comment",
        regex : "<#--",
        next : "comment"
    });

    this.$rules.comment.unshift({
        token : "comment",
        regex : ".*?-->",
        next : "start"
    }, {
        token : "comment",
        regex : ".+"
    });

    this.normalizeRules();
};

oop.inherits(FtlHighlightRules, HtmlHighlightRules);

exports.FtlHighlightRules = FtlHighlightRules;
});

