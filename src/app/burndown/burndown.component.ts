import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-burndown',
  templateUrl: './burndown.component.html',
  styleUrls: ['./burndown.component.css']
})

export class BurndownComponent implements OnInit {
  burndownIdeal: number[];
  burndownActual: number[];

  public options: any = {

   }
  constructor(private db: AngularFirestore ) {}
  ngOnInit(){
    const burndowns = this.db.collection("KanbanCard").snapshotChanges();
    burndowns.subscribe(docs =>
      docs.forEach(item => {
        var startDate = item.payload.doc.get("date");
        var endDate = item.payload.doc.get("completed")

        if(endDate == null) {
          console.log("Null detected");
        }
        console.log(startDate);
        console.log(endDate);
      }))

    Highcharts.chart('container', this.options);
  }

  // onCustomAction(event) {
  //   this.router.navigate(['/element'])
  //     .then(success => console.log('navigation success?' , success))
  //     .catch(console.error);
  // }
}


