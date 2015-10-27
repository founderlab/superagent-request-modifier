import _ from 'lodash'
import expect from 'expect'
import express from 'express'
import http from 'http'
import request from 'superagent'
import configure from '../src'

const config = {
  port: 8081,
  ip: 'localhost',
}
const app = express()

describe('configure', () => {

  before(done => {
    http.createServer(app).listen(config.port, config.ip, done)
  })

  it('should add a header to superagent requests', (done) => {
    const headers = {test: 'test'}
    configure(request, {hostname: 'localhost', headers})

    app.get('/test1', (req, res) => {
      expect(_.pick(req.headers, _.keys(headers))).toEqual(headers)
      res.status(200).send({})
    })

    request('http://localhost:8081/test1')
      .end((err, res) => {
        expect(err).toNotExist()
        expect(res.status).toBe(200)
        done()
      })
  })

  it('should reconfigure with a second call', (done) => {
    const headers = {test2: 'test2'}
    configure(request, {hostname: 'localhost', headers})

    app.get('/test2', (req, res) => {
      expect(_.pick(req.headers, _.keys(headers))).toEqual(headers)
      expect(req.headers.test).toNotExist()
      res.status(200).send({})
    })

    request('http://localhost:8081/test2')
      .end((err, res) => {
        expect(err).toNotExist()
        expect(res.status).toBe(200)
        done()
      })
  })

  it('should add a query', (done) => {
    const queries = {q_test: 'q_test'}
    configure(request, {hostname: 'localhost', queries})

    app.get('/query_test', (req, res) => {
      expect(_.pick(req.query, _.keys(queries))).toEqual(queries)
      res.status(200).send({})
    })

    request('http://localhost:8081/query_test')
      .end((err, res) => {
        expect(err).toNotExist()
        expect(res.status).toBe(200)
        done()
      })
  })

  it('should add a query stringified', (done) => {
    const queries = {q_test: {nested: 'q_test'}}
    configure(request, {hostname: 'localhost', queries})

    app.get('/query_test_2', (req, res) => {
      expect(req.query.q_test).toEqual(JSON.stringify(queries.q_test))
      res.status(200).send({})
    })

    request('http://localhost:8081/query_test_2')
      .end((err, res) => {
        expect(err).toNotExist()
        expect(res.status).toBe(200)
        done()
      })
  })

})
