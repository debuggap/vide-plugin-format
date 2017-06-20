var obj = {
    format: function format(data, indentLen) {
        var result;
        if (this.type(data) == 'array') {
            result = this.deal_array(data, indentLen);
        } else {
            result = this.deal_object(data, indentLen);
        }
        return result;
    },

    deal_array: function deal_array(data, indentLen) {
        var result = [];
        result.push('[');

        if (data.length != 0) {
            result.push('\n');
        }
        for (var i = 0, len = data.length; i < len; i++) {
            result.push(this.fileIndent(indentLen));
            switch (this.type(data[i])) {
                case 'boolean':
                case 'number':
                    result.push(data[i] + '');break;
                case 'string':
                    result.push(JSON.stringify(data[i]));break;
                case 'object':
                    result.push(this.deal_object(data[i], indentLen + 4));break;
                case 'array':
                    result.push(this.deal_array(data[i], indentLen + 4));break;
                default:
                    result.push('"', data[i].toString(), '"');break;
            }
            if (i != len - 1) {
                result.push(',');
            }
            result.push('\n');
        }

        result.push(this.fileIndent(indentLen - 4), ']');
        return result.join('');
    },

    deal_object: function deal_object(data, indentLen) {
        var result = [];
        result.push('{');

        var keys = Object.keys(data);
        if (keys.length != 0) {
            result.push('\n');
        }
        for (var i = 0, len = keys.length; i < len; i++) {
            result.push(this.fileIndent(indentLen), '"', keys[i], '": ');
            switch (this.type(data[keys[i]])) {
                case 'boolean':
                case 'number':
                    result.push(data[keys[i]] + '');break;
                case 'string':
                    result.push(JSON.stringify(data[keys[i]]));break;
                case 'object':
                    result.push(this.deal_object(data[keys[i]], indentLen + 4));break;
                case 'array':
                    result.push(this.deal_array(data[keys[i]], indentLen + 4));break;
                default:
                    result.push('"', data[keys[i]].toString(), '"');break;
            }
            if (i != len - 1) {
                result.push(',');
            }
            result.push('\n');
        }

        result.push(this.fileIndent(indentLen - 4), '}');
        return result.join('');
    },

    type: function type(value) {
        var type = '';
        if ((typeof value === 'undefined' ? 'undefined' : typeof(value)) == 'object') {
            if (value == null) {
                type = 'boolean';
            } else if (Object.prototype.toString.call(value) === '[object Array]') {
                type = 'array';
            } else if (Object.prototype.toString.call(value) === '[object Object]') {
                type = 'object';
            } else {
                type = 'other';
            }
        } else {
            type = typeof value === 'undefined' ? 'undefined' : typeof(value);
        }

        return type;
    },

    fileIndent: function fileIndent(len) {
        var i = 0,
            rt = "";
        while (i++ < len) {
            rt += " ";
        }return rt;
    }
};

module.exports = function (con, tabsize) {
  if (typeof con === 'string') {
    try {
      con = JSON.parse(con)
    } catch (e) {
      alert('Invalid JSON')
      return null
    }
  }
  return obj.format(con, tabsize)
}