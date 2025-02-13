import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { SystemTable, SystemTableNameField } from '../models/SystemTable';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-system-table',
  templateUrl: './system-table.component.html',
  styleUrls: ['./system-table.component.scss', '../../styles.scss'],
})
export class SystemTableComponent implements OnInit {
  title: string = 'הצגת טבלאות קהילתיות';
  descriptionLines: string[] = [
    'נותנת מענה לגורמים השונים בשרשרת הסחר בדבר נתונים החסרים להם לשם המשך עבודתם, וכן משמשת את הציבור הרחב לטובת פעילותו המכסית.',
    'הנתונים מוצגים בצורה מובנת של טבלאות קוד ממערכת שער עולמי. הנתונים ניתנים לחשיפה לכלל הציבור ללא צורך בזיהוי השואל.',
    'הנתונים מתעדכנים אחת ל 24 שעות.',
  ];

  currentIndex: number = 0;
  gridData: any;
  tables: any[] = [];
  filterTables: any[] = [];
  selectedtablesTypeList: any;
  columns: any[] = [];
  idList: any[] = [];
  selectedID: any;
  flag: boolean = false;
  param: string = 'TableConfiguration';
  tablesList: SystemTable[] = [];
  flagPaginator: boolean = false;
  tableWithHebrewFieldName: SystemTableNameField[] = [];
  isSuggestionsVisible: boolean = false;

  constructor(private http: HttpClient, private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const url = `/shaarolami/CustomspilotWeb/SystemTables/api/GetTableData?tableName=${this.param}`;
    this.callService(url).subscribe({
      next: (response) => this.onSuccessTables(response),
      error: (error) => console.error('Error fetching table data:', error),
    });
  }

  get selectedtablesTypeListString(): string {
    if (!this.selectedtablesTypeList) return '';
    return typeof this.selectedtablesTypeList === 'string'
      ? this.selectedtablesTypeList.toLowerCase()
      : this.selectedtablesTypeList.displayText.toLowerCase();
  }

  get selectedKey(): string {
    return this.selectedtablesTypeList?.key?.toLowerCase() || '';
  }

  get selectedIdd(): string {
    return this.selectedID?.toLowerCase() || '';
  }

  private onSuccessTables(data: any): void {
    this.tablesList = data.map(
      (r: any) =>
        new SystemTable(r.ID, r.MalamId, r.Name, r.State, r.ExtraStringData)
    );
  }

  private onSuccess(data: any, tableID: number): void {
    this.tableWithHebrewFieldName = data['ColumnsCaption'].reduce(
      (acc: SystemTableNameField[], r: any) => {
        if (
          !(
            (tableID === 1964 && r.Name === 'ID') ||
            (tableID === 2050 && r.Name === 'ID') ||
            (tableID === 239688 && r.Name === 'ExternalIdNum')
          )
        ) {
          acc.push(new SystemTableNameField(r.Name, r.Description));
        }
        return acc;
      },
      []
    );

    this.columns = this.tableWithHebrewFieldName;
    this.gridData = Object.values(data)[0];
  }

  private callService(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  @ViewChild('autoComplete') autoComplete!: AutoComplete;

  initSystemTablesList(list: SystemTable[]) {
    this.filterTables = list.filter((elem, index, self) => index === self.findIndex(i => i.ExtraStringData == elem.ExtraStringData));
    this.isSuggestionsVisible = this.filterTables.length > 0;
    this.renderer.removeAttribute(this.autoComplete, 'aria-expanded');
  }

  filterTablesType(): void {
    const pattern = this.selectedtablesTypeListString;
    this.filterTables = this.tablesList
      .filter(
        (r) =>
          !pattern ||
          r.displayText.toLowerCase().includes(pattern)
      )
      .sort((a, b) => {
        const aIndex = a.displayText.toLowerCase().indexOf(pattern);
        const bIndex = b.displayText.toLowerCase().indexOf(pattern);
        return aIndex - bIndex;
      });
  }

  searchData(): void {
    this.flagPaginator = true;
    this.columns = this.selectedtablesTypeList?.columns || [];
    const url = `/shaarolami/CustomspilotWeb/SystemTables/api/GetTableData?tableName=${this.selectedtablesTypeList.Name}&includeMetadata=true`;
    this.callService(url).subscribe({
      next: (response) =>
        this.onSuccess(response, this.selectedtablesTypeList.ID),
      error: (error) => console.error('Error fetching search data:', error),
    });
    this.resetPaging();
    setTimeout(() => {
      this.setPaginationAriaLabels();
    }, 1000);
  }

  @ViewChild('dt') table!: Table;

  resetPaging(): void {
    this.currentIndex = 0;
    this.table.reset();
  }
  @ViewChild('myTable') myTable!: Table;

  setPaginationAriaLabels() {
    const paginator = this.table.el.nativeElement.querySelector('.p-paginator') as HTMLElement;
    if (paginator) {
      paginator.setAttribute('role', 'list');
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'דפדוף');
      paginator.parentNode?.insertBefore(nav, paginator);
      nav.appendChild(paginator);
      const firstButton = paginator.querySelector('.p-paginator-first');
      const prevButton = paginator.querySelector('.p-paginator-prev');
      const nextButton = paginator.querySelector('.p-paginator-next');
      const lastButton = paginator.querySelector('.p-paginator-last');

      if (firstButton) firstButton.setAttribute('aria-label', 'עמוד ראשון');
      if (prevButton) prevButton.setAttribute('aria-label', 'עמוד קודם');
      if (nextButton) nextButton.setAttribute('aria-label', 'עמוד הבא');
      if (lastButton) lastButton.setAttribute('aria-label', 'עמוד אחרון');

      // setTimeout(() => {
      //   const ul = document.createElement('ul');
      //   ul.setAttribute('aria-label', 'רשימת כפתורים');
      //   ul.style.listStyleType = 'none';
      //   ul.style.padding = '0';
      //   // this.cdr.detectChanges();

      //   const buttons = paginator.querySelectorAll('button');
      //   paginator.innerHTML = '';
      //   paginator.appendChild(ul);

      //   buttons.forEach((button) => {
      //     const li = document.createElement('li');
      //     li.style.display = 'inline';
      //     li.style.marginRight = '8px';

      //     li.appendChild(button.cloneNode(true));
      //     ul.appendChild(li);
      //   });
      // }, 0);
    }
  }

  ngAfterViewInit() {
    const button = this.autoComplete.el.nativeElement.querySelector('button');
    if (button) {
      button.setAttribute('aria-label', 'לחץ כדי לפתוח רשימת טבלאות');
      button.setAttribute('tabindex', '0');
    }
  }

  toggleDropdownVisibility() {
    this.isSuggestionsVisible = !this.isSuggestionsVisible;
  }
}
