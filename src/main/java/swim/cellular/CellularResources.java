// Copyright 2015-2022 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package swim.cellular;

import java.io.IOException;
import java.io.InputStream;

import swim.codec.ParserException;
import swim.codec.Utf8;
import swim.json.Json;
import swim.recon.Recon;
import swim.structure.Value;

/**
 * Utilities for loading and parsing configuration resources.
 */
public final class CellularResources {
  private CellularResources() {
    // static
  }

  public static Value loadJsonResource(String jsonResource) {
    Value jsonValue = null;
    InputStream jsonInput = null;
    try {
      jsonInput = CellularPlane.class.getClassLoader().getResourceAsStream(jsonResource);
      if (jsonInput != null) {
        jsonValue = Utf8.read(jsonInput, Json.structureParser().valueParser());
      }
    } catch (IOException cause) {
      throw new ParserException(cause);
    } finally {
      try {
        if (jsonInput != null) {
          jsonInput.close();
        }
      } catch (IOException swallow) {
      }
    }
    return jsonValue;
  }

  public static Value loadReconResource(String reconResource) {
    Value reconValue = null;
    InputStream reconInput = null;
    try {
      reconInput = CellularPlane.class.getClassLoader().getResourceAsStream(reconResource);
      if (reconInput != null) {
        reconValue = Utf8.read(reconInput, Recon.structureParser().blockParser());
      }
    } catch (IOException cause) {
      throw new ParserException(cause);
    } finally {
      try {
        if (reconInput != null) {
          reconInput.close();
        }
      } catch (IOException swallow) {
      }
    }
    return reconValue;
  }

}
