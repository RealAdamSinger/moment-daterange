/* jshint node: true, maxlen: 200, -W030 */
/* global describe, it */

var should    = require('should');
var moment    = require('moment');
var expect = require('chai').expect;
require('../lib/moment-daterange');

describe('Moment', function() {
  var dr, m1, m2, mStart, mEnd, or, or2;

  before(function() {
    dr = moment.range(new Date(Date.UTC(2011, 2, 5)), new Date(Date.UTC(2011, 5, 5)));
    m1 = moment('2011-04-15', 'YYYY-MM-DD');
    m2 = moment('2012-12-25', 'YYYY-MM-DD');
    mStart = moment('2011-03-05', 'YYYY-MM-DD');
    mEnd = moment('2011-06-05', 'YYYY-MM-DD');
    or = moment.range(null, '2011-05-05');
    or2 = moment.range('2011-03-05', null);
  });

  describe('instances are recognizable', function() {
    it('instanceof moment.range should return true for moment.range objects', function() {
      dr = moment.range(m1, m2);
      (dr instanceof moment.range).should.be.true;      
    });

    it('moment.range.isRange should return true for moment.range objects', function() {
      dr = moment.range(m1, m2);
      moment.range.isRange(dr).should.be.true;      
    });
  });

  describe('#range()', function() {
    it('should return a DateRange with start & end properties', function() {
      dr = moment.range(m1, m2);
      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
    });

    it('should support string units like `year`, `month`, `week`, `day`, `minute`, `second`, etc...', function() {
      dr = m1.range('year');
      dr.start.valueOf().should.equal(moment(m1).startOf('year').valueOf());
      dr.end.valueOf().should.equal(moment(m1).endOf('year').valueOf());
    });
  });

  describe('#within()', function() {
    it('should determine if the current moment is within a given range', function() {
      m1.within(dr).should.be.true;
      m2.within(dr).should.be.false;
      m1.within(or).should.be.true;
      m1.within(or2).should.be.true;
      m2.within(or).should.be.false;
      m2.within(or2).should.be.true;
    });

    it('should consider the edges to be within the range', function() {
      mStart.within(dr).should.be.true;
      mEnd.within(dr).should.be.true;
    });
  });
});

describe('DateRange', function() {
  var d0 = new Date(Date.UTC(2011, 1, 5));
  var d1 = new Date(Date.UTC(2011, 2, 5));
  var d2 = new Date(Date.UTC(2011, 5, 5));
  var d3 = new Date(Date.UTC(2011, 4, 9));
  var d4 = new Date(Date.UTC(1988, 0, 1));  
  var m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
  var m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
  var m3 = moment.utc('08-12-1996', 'MM-DD-YYYY');
  var m4 = moment.utc('01-01-2012', 'MM-DD-YYYY');
  var sStart = '1996-08-12T00:00:00.000Z';
  var sEnd = '2012-01-01T00:00:00.000Z';
  var options = {
    exists: true
  };

  describe('constructor', function() {
    it('should allow initialization with date string', function() {
      var dr = moment.range(sStart, sEnd);

      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
    });

    it('should allow initialization with Date object', function() {
      var dr = moment.range(d1, d2);

      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
    });

    it('should allow initialization with Moment object', function() {
      var dr = moment.range(m1, m2);

      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
    });

    it('should allow initialization with an ISO 8601 Time Interval string', function() {
      var start = '2015-01-17T09:50:04+00:00';
      var end   = '2015-04-17T08:29:55+00:00';
      var dr = moment.range(start + '/' + end);

      moment.utc(start).isSame(dr.start).should.be.true;
      moment.utc(end).isSame(dr.end).should.be.true;
    });

    it('should allow initialization with an array', function() {
      var dr = moment.range([m1, m2]);

      m1.isSame(dr.start).should.be.true;
      m2.isSame(dr.end).should.be.true;
    });
    
    it('should allow initialization with open-ended ranges', function() {
      var dr = moment.range(null, m1);
      
      moment.isMoment(dr.start).should.be.true;
      
      dr = moment.range(m1, null);
      
      moment.isMoment(dr.end).should.be.true;
    });

    it('should allow initialization without any arguments', function() {
      var dr = moment.range();

      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
    });

    it('should allow initialization with undefined arguments', function() {
      var dr = moment.range(undefined, undefined, undefined);

      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
    });
    
    it('should allow initialization with options', function() {
      var dr = moment.range(sStart, sEnd, options);

      moment.isMoment(dr.start).should.be.true;
      moment.isMoment(dr.end).should.be.true;
      dr.options.should.be.type('object');
      
      dr.options.should.have.property('exists');
    });

    it('should allow initialization with options as second option', function() {
      dr = moment.range(m1, options);
      
      moment.isMoment(dr.end).should.be.true;
      dr.options.exists.should.be.true;
    });

  ///////////check actual and limit range
    it('should allow limit initialization with date string', function() {
      var ll = '1995-08-12T00:00:00.000Z';
      var ul = '1997-08-12T00:00:00.000Z';

      var dr = moment.range(sStart, sEnd, { 
        lowerLimit: ll,
        upperLimit: ul
      });

      moment.isMoment(dr.lowerLimit).should.be.true;
      moment.isMoment(dr.upperLimit).should.be.true;
      
      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    });

    it('should allow limit initialization with date object', function() {
      var ll = new Date(Date.UTC(2011, 2, 5));
      var ul = new Date(Date.UTC(2011, 5, 5));
      
      var dr = moment.range(sStart, sEnd, {
        lowerLimit: ll,
        upperLimit: ul,
      });

       moment.isMoment(dr.lowerLimit).should.be.true;
       moment.isMoment(dr.upperLimit).should.be.true;

        dr.lowerLimit.isSame(ll).should.be.true;
        dr.upperLimit.isSame(ul).should.be.true;
    });

    if('should allow limit initialization with Moment object', function() {
      var ll = moment.utc('06-05-1996', 'MM-DD-YYYY');
      var ul = moment.utc('11-05-1996', 'MM-DD-YYYY');

      var dr = moment.range(sStart, sEnd, {
        lowerLimit: ll,
        upperLimit: ul
      });

      moment.isMoment(dr.lowerLimit).should.be.true;
      moment.isMoment(dr.upperLimit).should.be.true;

      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    });

    it('should allow limit initialization with ISO 8601 Time Interval String', function() {
      var ll = '2011-01-17T09:50:04+00:00';
      var ul = '2011-04-17T08:29:55+00:00';

      var dr = moment.range(sStart, sEnd, {
        lowerLimit: ll,
        upperLimit: ul
      })
      
      moment.isMoment(dr.lowerLimit).should.be.true;
      moment.isMoment(dr.upperLimit).should.be.true;

      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    });

    it('should allow limit initialization with an array', function() {
      var ll = moment.utc('06-05-1996', 'MM-DD-YYYY');
      var ul = moment.utc('11-05-1996', 'MM-DD-YYYY');

      var dr = moment.range(sStart, sEnd, {
        lowerLimit: ll,
        upperLimit: ul
      });
      
      moment.isMoment(dr.lowerLimit).should.be.true;
      moment.isMoment(dr.upperLimit).should.be.true;

      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    })

    it('should allow limit initialization with open ended ranges', function() {
      var ll = moment.utc('06-05-2011', 'MM-DD-YYYY');
      var ul = moment.utc('11-05-2011', 'MM-DD-YYYY');

      var dr = moment.range(null ,sEnd, {
        lowerLimit: ll,
        upperLimit: ul
      });
      moment.isMoment(dr.lowerLimit).should.be.true;
      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    
      var dr = moment.range(sStart, {
        lowerLimit: ll,
        upperLimit: ul
      });
      moment.isMoment(dr.upperLimit).should.be.true;
      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    })

    it('should allow limit initialization without any arguments', function() {
      var ll = moment.utc('06-05-2011', 'MM-DD-YYYY');
      var ul = moment.utc('11-05-2011', 'MM-DD-YYYY');

      var dr = moment.range(undefined, undefined, {
        lowerLimit: ll,
        upperLimit: ul
      });

      moment.isMoment(dr.lowerLimit).should.be.true;
      moment.isMoment(dr.upperLimit).should.be.true;

      dr.lowerLimit.isSame(ll).should.be.true;
      dr.upperLimit.isSame(ul).should.be.true;
    })
  });

  describe('#clone()', function() {
    it('should deep clone range', function() {
      var dr1 = moment().range(sStart, sEnd);
      var dr2 = dr1.clone();

      dr2.start.add(2, 'days');
      dr1.start.toDate().should.not.equal(dr2.start.toDate());
    });
  });

  describe('#by()', function() {
    it('should iterate correctly by range', function() {
      var acc = [];
      var d1 = new Date(Date.UTC(2012, 2, 1));
      var d2 = new Date(Date.UTC(2012, 2, 5));
      var dr1 = moment.range(d1, d2);
      var dr2 = 1000 * 60 * 60 * 24;

      dr1.by(dr2, function(m) {
        acc.push(m);
      });

      acc.length.should.eql(5);
      acc[0].utc().date().should.eql(1);
      acc[1].utc().date().should.eql(2);
      acc[2].utc().date().should.eql(3);
      acc[3].utc().date().should.eql(4);
      acc[4].utc().date().should.eql(5);
    });

    it('should iterate correctly by duration', function() {
      var acc = [];
      var d1 = new Date(Date.UTC(2014, 9, 6, 0, 0));
      var d2 = new Date(Date.UTC(2014, 9, 6, 23, 59));
      var dr1 = moment.range(d1, d2);
      var dr2 = moment.duration(15, 'minutes');

      dr1.by(dr2, function(m) {
        acc.push(m);
      });

      acc.length.should.eql(96);
      acc[0].minute().should.eql(0);
      acc[95].minute().should.eql(45);
    });

    it('should iterate correctly by shorthand string', function() {
      var acc = [];
      var d1 = new Date(Date.UTC(2012, 2, 1));
      var d2 = new Date(Date.UTC(2012, 2, 5));
      var dr1 = moment.range(d1, d2);
      var dr2 = 'days';

      dr1.by(dr2, function(m) {
        acc.push(m);
      });

      acc.length.should.eql(5);
      acc[0].utc().date().should.eql(1);
      acc[1].utc().date().should.eql(2);
      acc[2].utc().date().should.eql(3);
      acc[3].utc().date().should.eql(4);
      acc[4].utc().date().should.eql(5);
    });

    it('should iterate correctly by year over a Date-constructed range when leap years are involved', function() {
      var acc = [];
      var d1 = new Date(Date.UTC(2011, 1, 1));
      var d2 = new Date(Date.UTC(2013, 1, 1));
      var dr1 = moment.range(d1, d2);
      var dr2 = 'years';

      dr1.by(dr2, function(m) {
        acc.push(m.utc().year());
      });

      acc.should.eql([2011, 2012, 2013]);
    });

    it('should iterate correctly by year over a moment()-constructed range when leap years are involved', function() {
      var acc = [];
      var dr1 = moment.range(moment('2011', 'YYYY'), moment('2013', 'YYYY'));
      var dr2 = 'years';

      dr1.by(dr2, function(m) {
        acc.push(m.year());
      });

      acc.should.eql([2011, 2012, 2013]);
    });

    it('should iterate correctly by month over a moment()-constructed range when leap years are involved', function() {
      var acc = [];
      var dr1 = moment.range(moment.utc('2012-01', 'YYYY-MM'), moment.utc('2012-03', 'YYYY-MM'));
      var dr2 = 'months';

      dr1.by(dr2, function(m) {
        acc.push(m.utc().format('YYYY-MM'));
      });

      acc.should.eql(['2012-01', '2012-02', '2012-03']);
    });

    it('should iterate correctly by month over a Date-contstructed range when leap years are involved', function() {
      var acc = [];
      var d1 = new Date(Date.UTC(2012, 0));
      var d2 = new Date(Date.UTC(2012, 2));
      var dr1 = moment.range(d1, d2);
      var dr2 = 'months';

      dr1.by(dr2, function(m) {
        acc.push(m.utc().format('YYYY-MM'));
      });

      acc.should.eql(['2012-01', '2012-02', '2012-03']);
    });

    it('should not include .end in the iteration if exclusive is set to true when iterating by string', function() {
      var my1 = moment('2014-04-02T00:00:00.000Z');
      var my2 = moment('2014-04-04T00:00:00.000Z');
      var dr1 = moment.range(my1, my2);
      var acc = [];

      dr1.by('d', (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), false);

      acc.should.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

      acc = [];

      dr1.by('d', (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), true);

      acc.should.eql(['2014-04-02', '2014-04-03']);

      acc = [];

      dr1.by('d', (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }));

      acc.should.eql(['2014-04-02', '2014-04-03', '2014-04-04']);
    });

    it('should not include .end in the iteration if exclusive is set to true when iterating by range', function() {
      var my1 = moment('2014-04-02T00:00:00.000Z');
      var my2 = moment('2014-04-04T00:00:00.000Z');
      var dr1 = moment.range(my1, my2);
      var dr2 = moment.range(my1, moment('2014-04-03T00:00:00.000Z'));
      var acc = [];

      dr1.by(dr2, function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      });

      acc.should.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

      acc = [];

      dr1.by(dr2, (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), false);

      acc.should.eql(['2014-04-02', '2014-04-03', '2014-04-04']);

      acc = [];

      dr1.by(dr2, (function(d) {
        acc.push(d.utc().format('YYYY-MM-DD'));
      }), true);

      acc.should.eql(['2014-04-02', '2014-04-03']);
    });

    it('should be exlusive when using by with minutes as well', function() {
      var d1 = moment('2014-01-01T00:00:00.000Z');
      var d2 = moment('2014-01-01T00:06:00.000Z');
      var dr = moment.range(d1, d2);
      var acc = [];

      dr.by('m', (function(d) {
        acc.push(d.utc().format('mm'));
      }));

      acc.should.eql(['00', '01', '02', '03', '04', '05', '06']);

      acc = [];

      dr.by('m', (function(d) {
        acc.push(d.utc().format('mm'));
      }), true);

      acc.should.eql(['00', '01', '02', '03', '04', '05']);
    });
  });

  describe('#toArray()', function() {
    it('should return array by range', function() {
      var d1 = new Date(Date.UTC(2012, 2, 1));
      var d2 = new Date(Date.UTC(2012, 2, 5));
      var dr1 = moment.range(d1, d2);
      var dr2 = 1000 * 60 * 60 * 24;

      var acc = dr1.toArray(dr2);

      acc.length.should.eql(5);
      acc[0].utc().date().should.eql(1);
      acc[1].utc().date().should.eql(2);
      acc[2].utc().date().should.eql(3);
      acc[3].utc().date().should.eql(4);
      acc[4].utc().date().should.eql(5);
    });

    it('should return array by shorthand string with exclusive', function() {
      var d1 = new Date(Date.UTC(2012, 2, 1));
      var d2 = new Date(Date.UTC(2012, 2, 5));
      var dr1 = moment.range(d1, d2);
      var dr2 = 'days';

      var acc = dr1.toArray(dr2, true);

      acc.length.should.eql(4);
      acc[0].utc().date().should.eql(1);
      acc[1].utc().date().should.eql(2);
      acc[2].utc().date().should.eql(3);
      acc[3].utc().date().should.eql(4);
    });
  });

  describe('#contains()', function() {
    it('should work with Date objects', function() {
      var dr = moment.range(d1, d2);

      dr.contains(d3).should.be.true;
      dr.contains(d4).should.be.false;
    });

    it('should work with Moment objects', function() {
      var dr = moment.range(m1, m2);

      dr.contains(m3).should.be.true;
      dr.contains(m4).should.be.false;
    });

    it('should work with DateRange objects', function() {
      var dr1 = moment.range(m1, m4);
      var dr2 = moment.range(m3, m2);

      dr1.contains(dr2).should.be.true;
      dr2.contains(dr1).should.be.false;
    });

    it('should be an inclusive comparison', function() {
      var dr1 = moment.range(m1, m4);

      dr1.contains(m1).should.be.true;
      dr1.contains(m4).should.be.true;
      dr1.contains(dr1).should.be.true;
    });

    it('should be exlusive when the exclusive param is set', function() {
      var dr1 = moment.range(m1, m2);

      dr1.contains(dr1, true).should.be.false;
      dr1.contains(dr1, false).should.be.true;
      dr1.contains(dr1).should.be.true;
      dr1.contains(m2, true).should.be.false;
      dr1.contains(m2, false).should.be.true;
      dr1.contains(m2).should.be.true;
    });
  });

  describe('#overlaps()', function() {
    it('should work with DateRange objects', function() {
      var dr1 = moment.range(m1, m2);
      var dr2 = moment.range(m3, m4);
      var dr3 = moment.range(m2, m4);
      var dr4 = moment.range(m1, m3);

      dr1.overlaps(dr2).should.be.true;
      dr1.overlaps(dr3).should.be.false;
      dr4.overlaps(dr3).should.be.false;
    });
  });

  describe('#intersect()', function() {
    var d5 = new Date(Date.UTC(2011, 2, 2));
    var d6 = new Date(Date.UTC(2011, 4, 4));
    var d7 = new Date(Date.UTC(2011, 6, 6));
    var d8 = new Date(Date.UTC(2011, 8, 8));

    it('should work with [---{==]---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d6, d8);

      dr1.intersect(dr2).isSame(moment.range(d6, d7)).should.be.true;
    });

    it('should work with {---[==}---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d8);
      var dr2 = moment.range(d5, d7);

      dr1.intersect(dr2).isSame(moment.range(d6, d7)).should.be.true;
    });

    it('should work with [{===]---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d5, d7);

      dr1.intersect(dr2).isSame(moment.range(d5, d6)).should.be.true;
    });

    it('should work with {[===}---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d5, d6);

      dr1.intersect(dr2).isSame(moment.range(d5, d6)).should.be.true;
    });

    it('should work with [---{===]} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d6, d7);

      dr1.intersect(dr2).isSame(moment.range(d6, d7)).should.be.true;
    });

    it('should work with {---[===}] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d7);

      dr1.intersect(dr2).isSame(moment.range(d6, d7)).should.be.true;
    });

    it('should work with [---] {---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d7, d8);

      should.strictEqual(dr1.intersect(dr2), null);
    });

    it('should work with {---} [---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d7, d8);
      var dr2 = moment.range(d5, d6);

      should.strictEqual(dr1.intersect(dr2), null);
    });

    it('should work with [---]{---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d6, d7);

      should.strictEqual(dr1.intersect(dr2), null);
    });

    it('should work with {---}[---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d6);
      should.strictEqual(dr1.intersect(dr2), null);
    });

    it('should work with {--[===]--} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d8);

      dr1.intersect(dr2).isSame(dr1).should.be.true;
    });

    it('should work with [--{===}--] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d8);
      var dr2 = moment.range(d6, d7);

      dr1.intersect(dr2).isSame(dr2).should.be.true;
    });

    it('should work with [{===}] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d5, d6);

      dr1.intersect(dr2).isSame(dr2).should.be.true;
    });

    it('should work with [--{}--] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d6);
      var dr2 = moment.range(d5, d7);

      dr1.intersect(dr2).isSame(dr1).should.be.true;
    });
  });

  describe('#add()', function() {
    var d5 = new Date(Date.UTC(2011, 2, 2));
    var d6 = new Date(Date.UTC(2011, 4, 4));
    var d7 = new Date(Date.UTC(2011, 6, 6));
    var d8 = new Date(Date.UTC(2011, 8, 8));

    it('should add ranges with [---{==]---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d6, d8);

      dr1.add(dr2).isSame(moment.range(d5, d8)).should.be.true;
    });

    it('should add ranges with {---[==}---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d8);
      var dr2 = moment.range(d5, d7);

      dr1.add(dr2).isSame(moment.range(d5, d8)).should.be.true;
    });

    it('should add ranges with [{===]---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d5, d7);

      dr1.add(dr2).isSame(moment.range(d5, d7)).should.be.true;
    });

    it('should add ranges with {[===}---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d5, d6);

      dr1.add(dr2).isSame(moment.range(d5, d7)).should.be.true;
    });

    it('should add ranges with [---{===]} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d6, d7);

      dr1.add(dr2).isSame(moment.range(d5, d7)).should.be.true;
    });

    it('should add ranges with {---[===}] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d7);

      dr1.add(dr2).isSame(moment.range(d5, d7)).should.be.true;
    });

    it('should not add ranges with [---] {---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d7, d8);

      should.strictEqual(dr1.add(dr2), null);
    });

    it('should not add ranges with {---} [---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d7, d8);
      var dr2 = moment.range(d5, d6);

      should.strictEqual(dr1.add(dr2), null);
    });

    it('should not add ranges with [---]{---} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d6, d7);

      should.strictEqual(dr1.add(dr2), null);
    });

    it('should not add ranges with {---}[---] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d6);

      should.strictEqual(dr1.add(dr2), null);
    });

    it('should add ranges {--[===]--} overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d8);

      dr1.add(dr2).isSame(moment.range(d5, d8)).should.be.true;
    });

    it('should add ranges [--{===}--] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d8);
      var dr2 = moment.range(d6, d7);

      dr1.add(dr2).isSame(moment.range(d5, d8)).should.be.true;
    });

    it('should add ranges [{===}] overlaps where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d5, d6);

      dr1.add(dr2).isSame(moment.range(d5, d6)).should.be.true;
    });
  });

  describe('#subtract()', function() {
    var d5 = new Date(Date.UTC(2011, 2, 2));
    var d6 = new Date(Date.UTC(2011, 4, 4));
    var d7 = new Date(Date.UTC(2011, 6, 6));
    var d8 = new Date(Date.UTC(2011, 8, 8));
    
    it('should turn [--{==}--] into (--) (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d8);
      var dr2 = moment.range(d6, d7);

      var dr1subtract2 = dr1.subtract(dr2);

      dr1subtract2.should.eql([moment.range(d5, d6), moment.range(d7, d8)]);
      dr1subtract2.should.not.eql(dr1);
    });

    it('should turn {--[==]--} into () where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d7);
      var dr2 = moment.range(d5, d8);

      dr1.subtract(dr2).should.eql([]);
    });

    it('should turn {[==]} into () where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d5, d6);

      dr1.subtract(dr2).should.eql([]);
    });

    it('should turn [--{==]--} into (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d6, d8);

      dr1.subtract(dr2).should.eql([moment.range(d5, d6)]);
    });

    it('should turn [--{==]} into (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d7);
      var dr2 = moment.range(d6, d7);

      dr1.subtract(dr2).should.eql([moment.range(d5, d6)]);
    });

    it('should turn {--[==}--] into (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d8);
      var dr2 = moment.range(d5, d7);

      dr1.subtract(dr2).should.eql([moment.range(d7, d8)]);
    });

    it('should turn {[==}--] into (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d6, d8);
      var dr2 = moment.range(d6, d7);

      dr1.subtract(dr2).should.eql([moment.range(d7, d8)]);
    });

    it('should turn [--] {--} into (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d5, d6);
      var dr2 = moment.range(d7, d8);

      dr1.subtract(dr2).should.eql([dr1]);
    });

    it('should turn {--} [--] into (--) where (a=[], b={})', function() {
      var dr1 = moment.range(d7, d8);
      var dr2 = moment.range(d5, d6);

      dr1.subtract(dr2).should.eql([dr1]);
    });

    it('should turn [--{==}--] into (--) where (a=[], b={})', function() {
      var o = moment.range('2015-04-07T00:00:00+00:00/2015-04-08T00:00:00+00:00');
      var s = moment.range('2015-04-07T17:12:18+00:00/2015-04-07T17:12:18+00:00');
      o.subtract(s).should.eql([moment.range('2015-04-07T00:00:00+00:00/2015-04-07T17:12:18+00:00'), moment.range('2015-04-07T17:12:18+00:00/2015-04-08T00:00:00+00:00')]);
    });
  });

  describe('#isSame()', function() {
    it('should true if the start and end of both DateRange objects equal', function() {
      var dr1 = moment.range(d1, d2);
      var dr2 = moment.range(d1, d2);

      dr1.isSame(dr2).should.be.true;
    });

    it('should false if the starts differ between objects', function() {
      var dr1 = moment.range(d1, d3);
      var dr2 = moment.range(d0, d3);

      dr1.isSame(dr2).should.be.false;
    });

    it('should false if the ends differ between objects', function() {
      var dr1 = moment.range(d1, d2);
      var dr2 = moment.range(d1, d3);

      dr1.isSame(dr2).should.be.false;
    });
  });

  describe('#toString()', function() {
    // it('should be a correctly formatted ISO8601 Time Interval', function() {
    //   var start = '2015-01-17T09:50:04+00:00';
    //   var end   = '2015-04-17T08:29:55+00:00';
    //   var dr = moment.range(moment.utc(start), moment.utc(end));

    //   dr.toString().should.equal(start + '/' + end);
    // });
  });

  describe('#valueOf()', function() {
    it('should be the value of the range in milliseconds', function() {
      var dr = moment.range(d1, d2);

      dr.valueOf().should.eql(d2.getTime() - d1.getTime());
    });

    it('should correctly coerce to a number', function() {
      var dr1 = moment.range(d4, d2);
      var dr2 = moment.range(d3, d2);

      (dr1 > dr2).should.be.true;
    });
  });

  describe('#toDate()', function() {
    it('should be a array like [dateObject, dateObject]', function() {
      var dr = moment.range(d1, d2);
      var drTodate = dr.toDate();

      drTodate.length.should.eql(2);
      drTodate[0].valueOf().should.eql(d1.valueOf());
      drTodate[1].valueOf().should.eql(d2.valueOf());
    });
  });

  describe('#diff()', function() {
    it('should use momentjs’ diff method', function() {
      var dr = moment.range(d1, d2);

      dr.diff('months').should.equal(3);
      dr.diff('days').should.equal(92);
      dr.diff().should.equal(7948800000);
    });
  });

  describe('#center()', function() {
    it('should use momentjs’ center method', function() {
      var d1 = new Date(Date.UTC(2011, 2, 5));
      var d2 = new Date(Date.UTC(2011, 3, 5));
      var dr = moment.range(d1, d2);

      dr.center().valueOf().should.equal(1300622400000);
    });
  });

  describe('#parseRange()', function() {
    it('should be an array', function() {
      var start = new Date(Date.UTC(2011, 2, 5));
      var end = new Date(Date.UTC(2011, 3, 5));
      var dr = moment.range(start, end);

      var parsedRange = dr.parseRange();

      parsedRange.should.have.length(2);
    })
  })

  describe('#_intersect()', function() {
    it('should set range within with acutal and limit ranges', function() {
      var start = moment("2016-01-02T00:00:00.000Z");
      var end = moment("2016-01-05T00:00:00.000Z");
      var lowerLimit = moment("2016-01-01T00:00:00.000Z");
      var upperLimit = moment("2016-01-04T00:00:00.000Z");
      
      var range = moment.range(start, end, {
        lowerLimit,
        upperLimit,
      });

       range.start.isSame(start).should.be.true;
       range.end.isSame(upperLimit).should.be.true;

       range.actualStart.isSame(start).should.be.true;
       range.actualEnd.isSame(end).should.be.true;

       expect(range.atStart).to.be.false;
       expect(range.atEnd).to.be.true;
    })

    it('should return undefinded when the limit is outside of range', function() {
      var start = moment("2016-01-01T00:00:00.000Z");
      var end = moment("2016-01-05T00:00:00.000Z");
      var lowerLimit = moment("2016-02-01T00:00:00.000Z");
      var upperLimit = moment("2016-02-04T00:00:00.000Z");
      
      var range = moment.range(start, end, {
        lowerLimit,
        upperLimit,
      });
      expect(range.start).to.be.an('undefined');
      expect(range.end).to.be.an('undefined');

      expect(range.atStart).to.be.false;
      expect(range.atEnd).to.be.false;
    })
  })

  describe('#setStart()', function() {
    it('should only set the start of the function', function() {
      var newStart = moment("2011-04-02T00:00:00.000Z");
      var newEnd = moment("2011-04-02T00:00:00.000Z");
      var start = moment("2011-05-01T00:00:00.000Z");
      var end = moment("2011-06-06T00:00:00.000Z");
      var lowerLimit = moment("2011-03-01T00:00:00.000Z");
      var upperLimit = moment("2011-05-04T00:00:00.000Z");
      var range = moment.range(start, end, {
        lowerLimit,
        upperLimit
      });

      range.setStart(newStart);

      range.start.isSame(newStart).should.be.true;
      range.end.isSame(upperLimit).should.be.true;

    })
  })

  describe('#setEnd', function() {
    it('should only set the end of the function', function() {
      var newEnd = moment("2011-04-02T00:00:00.000Z");
      var start = moment("2011-05-01T00:00:00.000Z");
      var end = moment("2011-06-06T00:00:00.000Z");
      var lowerLimit = moment("2011-03-01T00:00:00.000Z");
      var upperLimit = moment("2011-05-04T00:00:00.000Z");
      var range = moment.range(start, end, {
        lowerLimit,
        upperLimit
      });

      range.setEnd(newEnd);

      range.start.isSame(start).should.be.true;
      range.end.isSame(newEnd).should.be.true;
    })
  })

  describe('#setLowerLimit', function() {
    it('should only set the lower limit', function() {
      var newLowerLimit = moment("2011-04-02T00:00:00.000Z");
      var start = moment("2011-01-01T00:00:00.000Z");
      var end = moment("2011-06-06T00:00:00.000Z");
      var lowerLimit = moment("2011-03-01T00:00:00.000Z");
      var upperLimit = moment("2011-05-04T00:00:00.000Z");
      var range = moment.range(start, end, {
        lowerLimit,
        upperLimit
      });
      
     range.setLowerLimit(newLowerLimit);

      range.start.isSame(newLowerLimit).should.be.true;

    })
  })

    describe('#setUpperLimit()', function() {
      it('should only set the Upper limit', function() {
        var newUpperLimit = moment("2011-05-03T00:00:00.000Z");
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });
        
      range.setUpperLimit(newUpperLimit);

      range.end.isSame(newUpperLimit).should.be.true;

    })
  })

  describe('#clear()', function() {
    it('should clear start, clear end with empty args', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clear();
        range.start.isSame(lowerLimit).should.be.true;
        range.end.isSame(upperLimit).should.be.true;
    })

    it('should clear start, keep  end with false', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clear(true, false);
        range.start.isSame(lowerLimit).should.be.true;
        range.end.isSame(upperLimit).should.be.true;
    })

    it('should keep start, clear end with false', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clear(false, true);
        range.start.isSame(lowerLimit).should.be.true;
        range.end.isSame(upperLimit).should.be.true;
    })
    
    it('should keep start, keep  end with false', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clear(false, false);
        range.start.isSame(lowerLimit).should.be.true;
        range.end.isSame(upperLimit).should.be.true;
    })
  })

  describe('#clearLimits()', function() {
    it('should clear lower, clear upper with empty args', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clearLimits();
        range.start.isSame(start).should.be.true;
        range.end.isSame(end).should.be.true;
    })

    it('should clear lower, keep  upper with false', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clearLimits(true, false);
        range.start.isSame(start).should.be.true;
        range.end.isSame(upperLimit).should.be.true;
    })

    it('should keep lower, clear upper with false', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clearLimits(false, true);
        range.start.isSame(lowerLimit).should.be.true;
        range.end.isSame(end).should.be.true;
    })
    
    it('should keep lower, keep  upper with false', function() {
        var start = moment("2011-01-01T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.clearLimits(false, false);
        range.start.isSame(lowerLimit).should.be.true;
        range.end.isSame(upperLimit).should.be.true;
    })
  })

  describe('#shiftForward()', function() {
    it('should shift actualStart and actualEnd forward within limits', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftForward(86400000);

        range.actualStart.isSame(moment("2011-03-03T00:00:00.000Z")).should.be.true;
        range.actualEnd.isSame(moment("2011-05-07T00:00:00.000Z")).should.be.true;
    })

    it('should shift actualStart and actualEnd forward outside of limits', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-03-03T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-03-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftForward(moment.duration(5,'days'));

        range.actualStart.isSame(moment("2011-03-07T00:00:00.000Z")).should.be.true;
        range.actualEnd.isSame(moment("2011-03-08T00:00:00.000Z")).should.be.true;
        expect(range.start).to.be.an('undefined');
        expect(range.end).to.be.an('undefined');
    })

    it('should shift duration length of one actual duration forward', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-03-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftForward();

        range.actualStart.isSame(moment("2011-03-06T00:00:00.000Z")).should.be.true;
        range.actualEnd.isSame(moment("2011-03-10T00:00:00.000Z")).should.be.true;
    })
  })


  describe("#shiftBackward()", function() {
    it('should shift actualStart and actualEnd backward within limits', function() {
          var start = moment("2011-03-02T00:00:00.000Z");
          var end = moment("2011-05-06T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-05-04T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit
          });

          range.shiftBackward(86400000);

          range.actualStart.isSame(moment("2011-03-01T00:00:00.000Z")).should.be.true;
          range.actualEnd.isSame(moment("2011-05-05T00:00:00.000Z")).should.be.true;
    })

    it('should shift actualStart and actualEnd backward outsite of limits', function() {
          var start = moment("2011-03-02T00:00:00.000Z");
          var end = moment("2011-03-03T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-04T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit
          });

          range.shiftBackward(moment.duration(5,'days'));

          range.actualStart.isSame(moment("2011-02-25T00:00:00.000Z")).should.be.true;
          range.actualEnd.isSame(moment("2011-02-26T00:00:00.000Z")).should.be.true;
          expect(range.start).to.be.an('undefined');
          expect(range.end).to.be.an('undefined');
    })

    it('should shift duration length of one actual duration backward', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-03-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftBackward();

        range.actualStart.isSame(moment("2011-02-26T00:00:00.000Z")).should.be.true;
        range.actualEnd.isSame(moment("2011-03-02T00:00:00.000Z")).should.be.true;
    })
  })

  describe('#_containIntersect()', function() {
    it('should shift short range before limits inside of limits', function() {
          var start = moment("2011-01-01T00:00:00.000Z");
          var end = moment("2011-01-05T00:00:00.000Z");
          var lowerLimit = moment("2011-02-01T00:00:00.000Z");
          var upperLimit = moment("2011-02-20T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-02-01T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-02-05T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.true;
          expect(range.atEnd).to.be.false;
    })

    it('should shift short range after limits inside of limits', function() {
          var start = moment("2011-04-02T00:00:00.000Z");
          var end = moment("2011-04-05T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-31T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

         range.start.isSame(moment("2011-03-28T00:00:00.000Z")).should.be.true;
         range.end.isSame(moment("2011-03-31T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.false;
          expect(range.atEnd).to.be.true;
    })

    it('should shift long range before limits to be limits', function() {
          var start = moment("2011-02-01T00:00:00.000Z");
          var end = moment("2011-02-20T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-05T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-01T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-05T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.true;
          expect(range.atEnd).to.be.true;
      }) 

    it('should shift long range after limits to be limits', function() {
          var start = moment("2011-05-05T00:00:00.000Z");
          var end = moment("2011-07-05T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-31T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-01T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-31T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.true;
          expect(range.atEnd).to.be.true;
    })

    it('should shift overlap short range before limits to be inside limits', function() {
          var start = moment("2011-03-01T00:00:00.000Z");
          var end = moment("2011-03-05T00:00:00.000Z");
          var lowerLimit = moment("2011-03-04T00:00:00.000Z");
          var upperLimit = moment("2011-03-20T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-04T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-08T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.true;
          expect(range.atEnd).to.be.false;
    })

    it('should shift overlap short range after limits to be inside limits', function() {
          var start = moment("2011-03-10T00:00:00.000Z");
          var end = moment("2011-03-20T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-15T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-05T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-15T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.false;
          expect(range.atEnd).to.be.true;
    })

    it('should shift overlap long range before limits to be limits', function() {
          var start = moment("2011-03-01T00:00:00.000Z");
          var end = moment("2011-03-20T00:00:00.000Z");
          var lowerLimit = moment("2011-03-05T00:00:00.000Z");
          var upperLimit = moment("2011-03-08T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-05T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-08T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.true;
          expect(range.atEnd).to.be.true;
    })

    it('should shift overlap long range after limits to be limits', function() {
          var start = moment("2011-03-10T00:00:00.000Z");
          var end = moment("2011-03-30T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-15T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-01T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-15T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.true;
          expect(range.atEnd).to.be.true;
    })

    it('should be acutal start and end if both values within limit', function() {
          var start = moment("2011-03-03T00:00:00.000Z");
          var end = moment("2011-03-06T00:00:00.000Z");
          var lowerLimit = moment("2011-03-01T00:00:00.000Z");
          var upperLimit = moment("2011-03-15T00:00:00.000Z");
          var range = moment.range(start, end, {
            lowerLimit,
            upperLimit,
            contain: true
          });

          range.start.isSame(moment("2011-03-03T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2011-03-06T00:00:00.000Z")).should.be.true;

          expect(range.atStart).to.be.false;
          expect(range.atEnd).to.be.false;
    })

    it('should use Math.max to set correct values for start', function() {
          var start = moment("2000-02-01T00:00:00.000Z");
          var end = moment("2000-02-02T00:00:00.000Z");
          var lowerLimit = moment("2000-01-01T00:00:00.000Z");
          var upperLimit = moment("2000-03-01T00:00:00.000Z");
          var range = moment.range(start, end, {
            contain: true
          });

          range.shiftLimit(moment.duration(1,'day'));

          range.lowerLimit.isSame(moment("-271821-04-21T00:00:00.000Z")).should.be.true;
          range.upperLimit.isSame(moment("+275760-09-13T00:00:00.000Z")).should.be.true;
          range.start.isSame(moment("2000-02-01T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2000-02-02T00:00:00.000Z")).should.be.true;
    })

    it('should use Math.min to set correct values for end', function() {
          var start = moment("2000-02-01T00:00:00.000Z");
          var end = moment("2000-02-02T00:00:00.000Z");
          var lowerLimit = moment("2000-01-01T00:00:00.000Z");
          var upperLimit = moment("2000-03-01T00:00:00.000Z");
          var range = moment.range(start, end, {
            contain: true
          });

          range.shiftLimit(-(moment.duration(1,'day')));

          range.lowerLimit.isSame(moment("-271821-04-20T00:00:00.000Z")).should.be.true;
          range.upperLimit.isSame(moment("+275760-09-12T00:00:00.000Z")).should.be.true;
          range.start.isSame(moment("2000-02-01T00:00:00.000Z")).should.be.true;
          range.end.isSame(moment("2000-02-02T00:00:00.000Z")).should.be.true;
    })
  })

  describe('#shift()', function() {
    it('should shift forward with postive duration', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shift(86400000);

        range.actualStart.isSame(moment("2011-03-03T00:00:00.000Z")).should.be.true;
        range.actualEnd.isSame(moment("2011-05-07T00:00:00.000Z")).should.be.true;
    })
    
    it('should shift backward with negative duration', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-05-06T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-05-04T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shift(-86400000);

        range.actualStart.isSame(moment("2011-03-01T00:00:00.000Z")).should.be.true;
        range.actualEnd.isSame(moment("2011-05-05T00:00:00.000Z")).should.be.true;
    })
  })

  describe("Durations", function(){
    it('should check limit, actual, and set durations', function() {
        var start = moment("2011-03-02T00:00:00.000Z");
        var end = moment("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment("2011-03-01T00:00:00.000Z");
        var upperLimit = moment("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });
        
        (range.limitDuration._milliseconds).should.be.eql(432000000);
        (range.actualDuration._milliseconds).should.be.eql(518400000);
        (range.duration._milliseconds).should.be.eql(345600000);
    })
  })

  describe('#format()', function() {
    it('should format both dates with set delimiter', function() {
        var start = moment.utc("2011-03-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-03-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        rangeFormat = range.format("DD", "MMMM", ' - ');

        (rangeFormat).should.be.eql("02 - March");
    })

    it('should format both dates with default delimiter', function() {
        var start = moment.utc("2011-03-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-03-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        rangeFormat = range.format("DD", "MMMM");

        (rangeFormat).should.be.eql("02 March");
    })

    it('should return empty for start date', function() {
        var start = moment.utc("2011-03-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-03-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        rangeFormat = range.format(undefined, "MMMM");

        (rangeFormat).should.be.eql("March");
    })

    it('should return empty for start date', function() {
        var start = moment.utc("2011-02-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-02-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        rangeFormat = range.format("MMMM");

        (rangeFormat).should.be.eql("February");
    })
  })

  describe('#shiftLimitForward()', function() {
    
    it('should shift the limit forward', function() {
        var start = moment.utc("2011-02-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-02-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftLimitForward(moment.duration(1,'day'));
      
        range.lowerLimit.isSame("2011-02-02T00:00:00.000Z").should.be.true;
        range.upperLimit.isSame("2011-03-07T00:00:00.000Z").should.be.true;
    })
  })

  describe('#shiftLimitBackward()', function() {
    it('should shift the limit backwards', function () {
        var start = moment.utc("2011-02-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-02-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftLimitBackward(moment.duration(2, 'days'));

        range.lowerLimit.isSame("2011-01-30T00:00:00.000Z").should.be.true;
        range.upperLimit.isSame("2011-03-04T00:00:00.000Z").should.be.true;
    })
  })

  describe('#shiftLimit()', function() {
    it('should shift the limit using + duration value', function() {
        var start = moment.utc("2011-02-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-02-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftLimit(+86400000);
      
        range.lowerLimit.isSame("2011-02-02T00:00:00.000Z").should.be.true;
        range.upperLimit.isSame("2011-03-07T00:00:00.000Z").should.be.true;
    })

    it('should shift the limit using - duration value', function() {
        var start = moment.utc("2011-02-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-02-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftLimit(-172800000);

        range.lowerLimit.isSame("2011-01-30T00:00:00.000Z").should.be.true;
        range.upperLimit.isSame("2011-03-04T00:00:00.000Z").should.be.true;
    })
  })

  describe("#shiftAll()", function() {
    it('should shift actual start/end, and upper/lower limits', function() {
        var start = moment.utc("2011-02-02T00:00:00.000Z");
        var end = moment.utc("2011-03-08T00:00:00.000Z");
        var lowerLimit = moment.utc("2011-02-01T00:00:00.000Z");
        var upperLimit = moment.utc("2011-03-06T00:00:00.000Z");
        var range = moment.range(start, end, {
          lowerLimit,
          upperLimit
        });

        range.shiftAll(172800000);

        range.upperLimit.isSame("2011-03-08T00:00:00.000Z").should.be.true;
        range.lowerLimit.isSame("2011-02-03T00:00:00.000Z").should.be.true;
        range.actualStart.isSame("2011-02-04T00:00:00.000Z").should.be.true;
        range.actualEnd.isSame("2011-03-10T00:00:00.000Z").should.be.true;
    })
  })
}); //final describe
