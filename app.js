require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var logger = require('./utils/logger');
var requestTime = require('./utils/request-time');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
var documentsRouter = require('./routes/documents');

var app = express();

app.use(requestTime);
app.use(logger);
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/documents', documentsRouter);

app.use('/documents/files', express.static('uploads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send('ERROR: ' + err.message);
});

async function startServer(){
  await initalizeDatebase();//
}
module.exports = app;

const express = require ('express')
const app = express()
const initiazeDabase = require('./database/init');
const productsRouter= require ('./routes/productRoutes');


app. use(express.json());

app.use(`/api/products, productRoutes`);

// 데이터베이스 초기화 스크립트와 상품 라우트 모듈 불러오기
const initializeDatabase = require('./database/init');
const productRoutes = require('./routes/productRoutes');

// 미들웨어 설정
app.use(express.json());


// --- API 라우트 연결 ---
app.use('/api/products', productRoutes);

// --- 기본 라우트 (루트 경로) ---
app.get('/', (req, res) => {
  res.send('중고마켓 API 서버가 실행 중입니다!');
});


// --- 에러 핸들러 미들웨어 ---
app.use((err, req, res, next) => {
    console.error(err.stack); // 서버 콘솔에 에러 스택 출력
    res.status(500).json({ message: '알 수 없는 서버 오류가 발생했습니다.', error: err.message });
});


// --- 서버 시작 함수 ---
async function startServer() {

  await initializeDatabase(); //

  // Express 서버 시작
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    console.log('--- 상품 API 테스트 경로 예시 ---');
    console.log(' - 상품 등록 (POST): http://localhost:3000/api/products');
    console.log(' - 상품 목록 조회 (GET): http://localhost:3000/api/products?page=1&limit=5&sort=recent&search=티셔츠');
    console.log(' - 상품 상세 조회 (GET): http://localhost:3000/api/products/:id');
    console.log(' - 상품 수정 (PATCH): http://localhost:3000/api/products/:id');
    console.log(' - 상품 삭제 (DELETE): http://localhost:3000/api/products/:id');
  });
}

// 서버 시작 함수 호출
startServer();
// app.js

const express = require('express');
const app = express();
const port = 3000;

// 데이터베이스 초기화 스크립트 불러오기
const initializeDatabase = require('./database/init');

// 라우트 모듈 불러오기
const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes'); // 게시글 라우트 불러오기
const commentRoutes = require('./routes/commentRoutes'); // 댓글 라우트 불러오기

// 미들웨어 설정 (기존과 동일)
app.use(express.json());

// --- API 라우트 연결 ---
// 상품 API 라우트
app.use('/api/products', productRoutes);

// 게시글 API 라우트
app.use('/api/articles', articleRoutes);

// 댓글 API 라우트 (게시글 아래에 중첩하여 댓글 ID를 사용하거나, 별도 엔드포인트도 가능)
// '/api/articles/:articleId/comments' 형태의 URL을 위해 :articleId를 라우터 안에서 처리하도록 설정
app.use('/api', commentRoutes); // 또는 app.use('/api/comments', commentRoutes); 로 단독 사용도 가능.
                                // 위 예시의 commentRoutes는 :articleId/comments 형태를 사용하므로 '/api'로 설정.

// 기본 라우트 (기존과 동일)
app.get('/', (req, res) => {
  res.send('중고마켓 & 자유게시판 API 서버가 실행 중입니다!');
});

// 에러 핸들러 미들웨어 (기존과 동일)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '알 수 없는 서버 오류가 발생했습니다.', error: err.message });
});

// 서버 시작 함수 (기존과 동일)
async function startServer() {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    console.log('--- 상품 API 테스트 경로 예시 (기존과 동일) ---');
    console.log(' - 상품 등록 (POST): http://localhost:3000/api/products');
    // ... (기존 상품 API 경로들)

    console.log('\n--- 게시글 API 테스트 경로 예시 ---');
    console.log(' - 게시글 등록 (POST): http://localhost:3000/api/articles');
    console.log(' - 게시글 목록 조회 (GET): http://localhost:3000/api/articles?page=1&limit=5&sort=recent&search=제목');
    console.log(' - 게시글 상세 조회 (GET): http://localhost:3000/api/articles/:id');
    console.log(' - 게시글 수정 (PATCH): http://localhost:3000/api/articles/:id');
    console.log(' - 게시글 삭제 (DELETE): http://localhost:3000/api/articles/:id');

    console.log('\n--- 댓글 API 테스트 경로 예시 ---');
    console.log(' - 댓글 등록 (POST): http://localhost:3000/api/articles/:articleId/comments');
    console.log(' - 댓글 목록 조회 (GET - 커서): http://localhost:3000/api/articles/:articleId/comments?lastId=0&limit=5');
    console.log(' - 댓글 수정 (PATCH): http://localhost:3000/api/comments/:id');
    console.log(' - 댓글 삭제 (DELETE): http://localhost:3000/api/comments/:id');
  });
}

startServer();

const express = require('express');
const app = express();

app.use('/uploads', express.static('uploads')); 

const express = require('express');
const app = express();

app.use('/uploads', express.static('uploads'));
