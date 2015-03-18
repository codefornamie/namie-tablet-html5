/*
 * Copyright 2015 NamieTown
 *             http://www.town.namie.fukushima.jp/
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package jp.fukushima.namie.town.PcsAccountManagerPlugin;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Encrypt strings.
 */
public class Encryption {

    /* メッセージダイジェストアルゴリズム */
    public MessageDigest md = null;

    public static void main(String[] args) {
        final String algorithmName = "SHA-256";
        final String source = args[0];

        Encryption encryption = new Encryption(algorithmName);
        String result = encryption.toHashedString(source);
        System.out.println(result);
    }

    /*
     * 引数でメッセージダイジェストアルゴリズムを指定する。 MD2, MD5, SHA, SHA-256, SHA-384, SHA-512が利用可能。
     */
    public Encryption(String algorithmName) {
        try {
            md = MessageDigest.getInstance(algorithmName);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    /*
     * メッセージダイジェストアルゴリズムを使い、文字列をハッシュ値へ変換する。
     */
    public byte[] toHashValue(String password) {
        md.update(password.getBytes());
        return md.digest();
    }

    /*
     * バイト配列を16進数の文字列に変換し、連結して返す。
     */
    public String toEncryptedString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            String hex = String.format("%02x", b);
            sb.append(hex);
        }
        return sb.toString();
    }

    public String toHashedString(String src) {
        byte[] bytes = toHashValue(src);
        String result = toEncryptedString(bytes);
        return result;
    }
}
