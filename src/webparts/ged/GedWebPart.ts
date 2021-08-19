import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './GedWebPart.module.scss';
import * as strings from 'GedWebPartStrings';


import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');

require('./perso.css')

export interface IGedWebPartProps {
  description: string;
}

export default class GedWebPart extends BaseClientSideWebPart<IGedWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <div class="container">
    <div class="card no-radius">
        <div class="card-header marge">
            <h4><i class="fa fa-file text-dark fa-lg"></i> Demande de validation</h4>
        </div>
        <div class="card-body">
            <div class="alert alert-info" id="loading">Loading...</div>
            
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label class="">Code agence</label>
                    <input type="text" class="form-control" id="codeAgence" placeholder="BI900" />
                </div>
                <div class="form-group col-md-4">
                    <label class="">Code guichet</label>
                    <input type="text" class="form-control" id="codeGuichet" placeholder="BI900" />
                </div>
                <div class="form-group col-sm-4">
                    <label>Date</label>
                    <input type="date" class="form-control font-ms" id="date" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-12">
                    <label class="">Type d'opération</label>
                    <select class="form-control" id="typeOperation">
                        <option value="">Choisir le type d'opération</option>
                        <option value="R">Retrait</option>
                        <option value="V">Versement</option>
                    </select>
                </div>
            </div>

            <!--div class="form-row">
                <div class="form-group col-md-6">
                  <label>Type d'opération</label>
                </div>
                <div class="form-group col-md-6">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type-operation" id="radioRetrait" value="retrait">
                    <label class="form-check-label">Retrait</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type-operation" id="radioVersement" value="versement">
                    <label class="form-check-label">Versement</label>
                  </div>
                </div>
            </div-->

            <div class="form-row">
                <div class="form-group col-sm-6">
                    <label>Numero opération</label>
                    <input type="text" class="form-control" id="numeroOperation" />
                </div>
                <div class="form-group col-sm-6">
                    <label>Numéro client</label>
                    <input type="text" class="form-control" id="numeroClient" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Fiche de vigilance</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="ficheVigilance" required>
                        <label class="custom-file-label" for="ficheVigilance">Choose file...</label>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <label class="">Montant</label>
                    <input type="numeric" min="1000000" class="form-control" id="montant" />
                </div>
                <div class="form-group col-sm-6">
                    <label>Référence du chèque</label>
                    <input type="numeric" class="form-control" id="referenceCheque" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Bénéficiaire</label>
                    <input type="text" class="form-control" id="beneficiaire" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Motif de la demande</label>
                    <textarea class="form-control" id="motif" ></textarea>
                </div>
            </div>

        </div>

        <div class="card-footer text-right">
            <button class="btn btn-success" type="button" id="btnSave">Enregistrer</button>
            <button class="btn btn-danger" type="button" id="btnReset">Reset</button>
        </div>
    </div>
</div>`;

    $(document).ready(() => {
      $("#blocRetrait").hide();
      $("#blocVersement").hide();

      $("#loading").hide();

      $("#btnSave").click(() => {
        let select = $("select[name='type']").val();
        $("#loading").text(select).show();
      });

      $("input[type='radio'][name='type-operation']").change(() => {
        let type = $("input[type='radio'][name='type-operation']:checked").val();
        if (type === 'versement') {
          $("#blocRetrait").hide();
          $("#blocVersement").show();
        } else {
          $("#blocRetrait").show();
          $("#blocVersement").hide();
        }
      });

      $("#typeOperation").change(() => {
        let type = $("#typeOperation").val();
        if (type === 'V') {
          $("#blocRetrait").hide();
          $("#blocVersement").show();
        } else {
          $("#blocRetrait").show();
          $("#blocVersement").hide();
        }
      });



      $("#btnReset").click(() => {
        $("#loading").empty().hide();
      });
    });
  }

  /*private SaveItemToList(): void {
    debugger;
    const body: string = JSON.stringify({

      'Title': document.getElementById('idTitle')["value"],

      'CustName': document.getElementById('idCustName')["value"],

      'CustGender': document.getElementById('idCustGender')["value"],

      'CustNumber': document.getElementById('idCustNumber')["value"],

      'CustCategory': document.getElementById('idCustCategory')["value"],

      'CustMobileNumber': document.getElementById('idCustMobileNumber')["value"],

      'CustCity': document.getElementById('idCustCity')["value"],

      'Remark': document.getElementById('idRemark')["value"]

    });

    this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`,

      SPHttpClient.configurations.v1,

      {

        headers: {

          'Accept': 'application/json;odata=nometadata',

          'Content-type': 'application/json;odata=nometadata',

          'odata-version': ''

        },

        body: body

      }).then((response: SPHttpClientResponse): Promise<IListItem> => {

        return response.json();

      }).then((item: IListItem): void => {

      }, (error: any): void => {
        alert(`${error}`);
      });

  }*/

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
