"use client"

import React from "react"
import "./globals.css"

export default function TestCssImport() {
  return (
    <div className="p-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">CSS Import Test</h1>
      <p className="mb-2">If you can see styled text below, CSS is working:</p>
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
        <p className="text-white font-bold">This should have a gradient background</p>
      </div>
    </div>
  )
}