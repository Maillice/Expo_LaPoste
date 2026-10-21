import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { cleanTitle, inferFromPath, inferLang, inferYear, matchKey } from '../src/importer/infer.js'

describe('inférence depuis le chemin', () => {
  it('année', () => {
    assert.equal(inferYear('Timbres/1968/masque.jpg'), 1968)
    assert.equal(inferYear('img123456.jpg'), null)
  })
  it('titre propre', () => assert.equal(cleanTitle('masques_de_bwa_1968'), 'Masques de bwa'))
  it('collection et thème', () => {
    const r = inferFromPath('Faune/elephant_1978.jpg')
    assert.equal(r.collection, 'faune-environnement')
    assert.equal(r.theme, 'environnement')
    assert.equal(r.annee, 1978)
  })
  it('langue des médias', () => {
    assert.equal(inferLang('Videos/intro_Moore.mp4'), 'mo')
    assert.equal(inferLang('intro english.mp4'), 'en')
    assert.equal(inferLang('intro.mp4'), 'fr')
  })
  it('clé de rapprochement', () => assert.equal(matchKey('a/Masque-Bwa_1968.JPG'), matchKey('masque bwa 1968.glb')))
})
