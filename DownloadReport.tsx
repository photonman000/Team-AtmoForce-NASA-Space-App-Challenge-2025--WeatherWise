import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileDown, FileText, Table, Share2 } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  city: string;
}

interface WeatherData {
  veryHot: number;
  veryWet: number;
  veryWindy: number;
  veryCold: number;
  comfortIndex: number;
}

interface DownloadReportProps {
  selectedLocation?: Location | null;
  selectedDate?: Date | null;
  weatherData?: WeatherData | null;
  selectedProfile?: string | null;
}

export function DownloadReport({ selectedLocation, selectedDate, weatherData, selectedProfile }: DownloadReportProps) {
  const generateCSVReport = () => {
    if (!selectedLocation || !selectedDate || !weatherData) return;

    const csvData = [
      ['WeatherWise Report'],
      ['Generated:', new Date().toISOString()],
      [''],
      ['Location:', selectedLocation.city],
      ['Coordinates:', `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`],
      ['Date:', selectedDate.toLocaleDateString()],
      ['Profile:', selectedProfile || 'General'],
      [''],
      ['Weather Analysis:'],
      ['Very Hot Probability (%)', weatherData.veryHot],
      ['Very Wet Probability (%)', weatherData.veryWet],
      ['Very Windy Probability (%)', weatherData.veryWindy],
      ['Very Cold Probability (%)', weatherData.veryCold],
      ['Comfort Index (%)', weatherData.comfortIndex],
      [''],
      ['Data Source: NASA POWER & GPM IMERG'],
      ['Analysis Type: Historical Weather Probability'],
      ['Confidence Level: Based on 20+ years satellite data']
    ];

    const csvContent = csvData.map(row => 
      Array.isArray(row) ? row.join(',') : row
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weatherwise-report-${selectedLocation.city.replace(/\s+/g, '-')}-${selectedDate.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generatePDFReport = () => {
    if (!selectedLocation || !selectedDate || !weatherData) return;

    // Create a formatted HTML content for PDF generation
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WeatherWise Report</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #3B82F6; }
            .subtitle { color: #6B7280; margin-top: 10px; }
            .section { margin: 25px 0; }
            .section-title { font-size: 18px; font-weight: bold; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; }
            .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .gauge-card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; text-align: center; }
            .gauge-value { font-size: 24px; font-weight: bold; color: #3B82F6; }
            .gauge-label { color: #6B7280; font-size: 14px; margin-top: 5px; }
            .comfort-index { background: linear-gradient(135deg, #EFF6FF, #DBEAFE); padding: 20px; border-radius: 8px; text-align: center; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌍 WeatherWise</div>
            <div class="subtitle">Historical Weather Probability Analysis</div>
          </div>
          
          <div class="section">
            <div class="section-title">Location & Date Information</div>
            <p><strong>Location:</strong> ${selectedLocation.city}</p>
            <p><strong>Coordinates:</strong> ${selectedLocation.lat.toFixed(4)}°, ${selectedLocation.lng.toFixed(4)}°</p>
            <p><strong>Analysis Date:</strong> ${selectedDate.toLocaleDateString()}</p>
            <p><strong>User Profile:</strong> ${selectedProfile ? selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1) : 'General'}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <div class="section-title">Weather Probability Analysis</div>
            <div class="data-grid">
              <div class="gauge-card">
                <div class="gauge-value">${weatherData.veryHot}%</div>
                <div class="gauge-label">🌡️ Very Hot</div>
              </div>
              <div class="gauge-card">
                <div class="gauge-value">${weatherData.veryWet}%</div>
                <div class="gauge-label">🌧️ Very Wet</div>
              </div>
              <div class="gauge-card">
                <div class="gauge-value">${weatherData.veryWindy}%</div>
                <div class="gauge-label">🌬️ Very Windy</div>
              </div>
              <div class="gauge-card">
                <div class="gauge-value">${weatherData.veryCold}%</div>
                <div class="gauge-label">❄️ Very Cold</div>
              </div>
            </div>
            
            <div class="comfort-index">
              <div class="gauge-value" style="font-size: 36px;">${weatherData.comfortIndex}%</div>
              <div class="gauge-label" style="font-size: 16px;">🙂 Overall Comfort Index</div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Data Sources:</strong> NASA POWER Global Meteorology Dataset, NASA GPM IMERG Precipitation Data</p>
            <p><strong>Analysis Method:</strong> Historical weather probability based on 20+ years of satellite observations</p>
            <p><strong>Disclaimer:</strong> This analysis is based on historical data patterns and should be used for planning purposes. Always check current weather forecasts for real-time conditions.</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const shareReport = () => {
    if (!selectedLocation || !selectedDate || !weatherData) return;

    const shareText = `🌍 WeatherWise Analysis for ${selectedLocation.city} on ${selectedDate.toLocaleDateString()}

🌡️ Hot Risk: ${weatherData.veryHot}%
🌧️ Rain Risk: ${weatherData.veryWet}%
🌬️ Wind Risk: ${weatherData.veryWindy}%
❄️ Cold Risk: ${weatherData.veryCold}%
🙂 Comfort Index: ${weatherData.comfortIndex}%

Based on NASA satellite data. Plan smarter with WeatherWise!`;

    if (navigator.share) {
      navigator.share({
        title: 'WeatherWise Analysis',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Report summary copied to clipboard!');
      });
    }
  };

  const isDataAvailable = selectedLocation && selectedDate && weatherData;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-gray-800 flex items-center gap-2">
          <FileDown className="w-5 h-5 text-purple-600" />
          Export Report
        </h3>
        {isDataAvailable && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Ready
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={generateCSVReport}
          disabled={!isDataAvailable}
          variant="outline"
          className="w-full justify-start gap-3 h-12 text-left bg-white border-purple-200 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Table className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium">Download CSV</div>
            <div className="text-xs text-gray-500">Spreadsheet format</div>
          </div>
        </Button>

        <Button
          onClick={generatePDFReport}
          disabled={!isDataAvailable}
          variant="outline"
          className="w-full justify-start gap-3 h-12 text-left bg-white border-purple-200 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium">Print PDF</div>
            <div className="text-xs text-gray-500">Formatted report</div>
          </div>
        </Button>

        <Button
          onClick={shareReport}
          disabled={!isDataAvailable}
          variant="outline"
          className="w-full justify-start gap-3 h-12 text-left bg-white border-purple-200 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium">Share Analysis</div>
            <div className="text-xs text-gray-500">Copy or send summary</div>
          </div>
        </Button>
      </div>

      {!isDataAvailable && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Select location, date, and generate weather analysis to enable report downloads.
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Reports include NASA data sources and analysis methodology
      </div>
    </Card>
  );
}