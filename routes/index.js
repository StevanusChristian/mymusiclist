var express = require('express');
var router = express.Router();

var session_store;

/* GET home page. */
router.get('/', function(req, res, next) {
  req.getConnection(function(err, connection){
    var query = connection.query('SELECT * FROM tbmusic', function(err, rows){
      if(err)
      var error = ("Error Selecting : %s ", err);
      req.flash('msg_error', error);
      res.render('index', { title: 'MyMusicList', data: rows, session_store: req.session});
    });
  });
});
module.exports = router;

router.post('/add', function(req, res, next){
  req.assert('name', 'Please fill the name').notEmpty();
  var errors = req.validationErrors();
  if(!errors){
    v_name = req.sanitize('name').escape().trim();
    v_artist = req.sanitize('artist').escape().trim();
    v_album = req.sanitize('album').escape().trim();
    v_genre = req.sanitize('genre').escape().trim();
    v_released = req.sanitize('released').escape().trim();

    var music = {
      name: v_name,
      artist: v_artist,
      album: v_album,
      genre: v_genre,
      released: v_released
    }

    var insert_sql = 'INSERT INTO tbmusic SET ?';
    req.getConnection(function(err, connection){
      var query = connection.query(insert_sql, music, function(err, result){
        if(err){
          var errors_detail = ("Error Insert : %s ", err);
          req.flash('msg_error', errors_detail);
          res.render('add', {
            name: req.param('name'),
            artist: req.param('artist'),
            album: req.param('album'),
            genre: req.param('genre'),
            released: req.param('released')
          });
        } else{
          req.flash('msg_info', 'Create music data success');
          res.redirect('/');
        }
      });
    });
  } else{
    console.log(errors);
    errors_detail = "Sorry there are errors <ul>";
    for(i in errors){
      error = errors[i];
      errors_detail += '<li>'+error.msg+'</li>';
    }
    errors_detail += "</ul>";
    req.flash('msg_error', errors_detail);
    res.render('add', {
      name: req.param('name'),
      artist: req.param('artist'),
    });
  }
});

router.get('/add', function(req, res, next){
  res.render('add', {
    title: 'MyMusicList | Add Music',
    name: '',
    artist: '',
    album: '',
    genre: '',
    released: ''
  });
});

router.get('/edit/(:id)', function(req, res, next){
  req.getConnection(function(err, connection){
    var query = connection.query('SELECT * FROM tbmusic WHERE id='+req.params.id, function(err, rows){
      if(err){
        var errorrr = ("Error Selecting : %s ", err);
        req.flash('msg_error', errors_detail);
        res.redirect('/');
      } else{
        if(rows.length <= 0){
          req.flash('msg_error', "Music Not Found!");
          res.redirect('/');
        } else{
          console.log(rows);
          res.render('edit', {title: "MyMusicList | Edit ", data: rows[0]});
        }
      }
    });
  });
});

router.put('/edit/(:id)', function(req, res, next){
  req.assert('name', 'Please fill the name').notEmpty();
  var errors = req.validationErrors();
  if(!errors){
    v_name = req.sanitize('name').escape().trim();
    v_artist = req.sanitize('artist').escape().trim();
    v_album = req.sanitize('album').escape().trim();
    v_genre = req.sanitize('genre').escape().trim();
    v_released = req.sanitize('released').escape().trim();

    var music = {
      name: v_name,
      artist: v_artist,
      album: v_album,
      genre: v_genre,
      released: v_released
    }

    var update_sql = 'UPDATE tbmusic SET ? WHERE id='+req.params.id;
    req.getConnection(function(err, connection){
      var query = connection.query(update_sql, music, function(err, result){
        if(err){
          var errors_detail = ("Error Update : %s ", err);
          req.flash('msg_error', errors_detail);
          res.render('edit', {
            name: req.param('name'),
            artist: req.param('artist'),
            album: req.param('album'),
            genre: req.param('genre'),
            released: req.param('released')
          });
        } else{
          req.flash('msg_info', 'Update music data success');
          res.redirect('/');
        }
      });
    });
  } else{
    console.log(errors);
    errors_detail = "Sorry there are errors <ul>";
    for(i in errors){
      error = errors[i];
      errors_detail += '<li>'+error.msg+'</li>';
    }
    errors_detail += "</ul>";
    req.flash('msg_error', errors_detail);
    res.render('edit', {
      name: req.param('name'),
      artist: req.param('artist'),
    });
  }
});

router.delete('/delete/(:id)', function(req, res, next){
  req.getConnection(function(err, connection){
    var music = {
      id: req.params.id,
    }

    var delete_sql = 'DELETE FROM tbmusic WHERE ?';
    req.getConnection(function(err, connection){
      var query = connection.query(delete_sql, music, function(err, result){
        if(err){
          var errors_detail = ("Error Delete : %s ", err);
          req.flash('msg_error', errors_detail);
          res.redirect('/');
        } else{
          req.flash('msg_info', 'Delete data success');
          res.redirect('/');
        }
      });
    });
  });
});